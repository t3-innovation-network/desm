import React, { useState, useEffect } from "react";
import AlertNotice from "../shared/AlertNotice";
import FileInfo from "./FileInfo";
import { useSelector, useDispatch } from "react-redux";
import { setFiles, setMergedFile, setSpecToPreview } from "../../actions/files";
import {
  doSubmit,
  startProcessingFile,
  stopProcessingFile,
  setMappingFormData,
  doUnsubmit,
} from "../../actions/mappingform";
import fetchDomains from "../../services/fetchDomains";
import { toastr as toast } from "react-redux-toastr";
import MultipleDomainsModal from "./MultipleDomainsModal";
import checkDomainsInFile from "../../services/checkDomainsInFile";
import filterSpecification from "../../services/filterSpecification";
import mergeFiles from "../../services/mergeFiles";
import { setVocabularies } from "../../actions/vocabularies";
import { validURL } from "../../helpers/URL";

const MappingForm = () => {
  const [errors, setErrors] = useState("");

  /// Name of the specification
  const [name, setName] = useState("");

  /// Version of this specification
  const [version, setVersion] = useState("");

  /// Use case for this specification
  const [useCase, setUseCase] = useState("");

  /// The list  of domains (from the skos file)
  const [domains, setDomains] = useState([]);

  /// The selected domain to map to
  const [selectedDomainId, setSelectedDomainId] = useState(null);

  /// Whether there's more than one domain found in the uploaded file
  const [multipleDomainsInFile, setMultipleDomainsInFile] = useState(false);

  /// Which domains were found in the uploaded file (the api parses
  /// the file to get to it)
  const [domainsInFile, setDomainsInFile] = useState([]);

  /// The value of the input that the user is typing in the search box
  /// when there are many domains in the uploaded file
  const [inputValue, setInputValue] = useState("");

  /// The domains that includes the string typed by the user in the
  /// search box when there are many domains in the uploaded file
  const filteredDomainsInFile = domainsInFile.filter((domain) => {
    return domain.label.toLowerCase().includes(inputValue.toLowerCase());
  });

  /// The files uploaded by the user
  const files = useSelector((state) => state.files);

  /// The unified file from the ones the user uploaded
  const mergedFile = useSelector((state) => state.mergedFile);

  /// The preview files (files already prepared to be previewed, as
  /// without the unrelated domains and properties)
  const previewSpecs = useSelector((state) => state.previewSpecs);

  /// Whether the form was submitted or not, in order to show the preview
  const submitted = useSelector((state) => state.submitted);

  /// Whether we are processing the file or not
  const processingFile = useSelector((state) => state.processingFile);

  const dispatch = useDispatch();

  /**
   * Update the files in the redux store (main application state) when
   * the input changes (after the user selects file/s)
   */
  const handleFileChange = (event) => {
    dispatch(setFiles(Array.from(event.target.files)));
  };

  /**
   * Validates the use case to be a valid URL after the user focuses
   * out the "use case" input
   */
  const handleUseCaseBlur = () => {
    if (!validURL(useCase)) {
      setErrors("'Use case' must be a valid URL");
    } else {
      setErrors("");
    }
  };

  /**
   * Set multiple domains flag to false
   */
  const unsetMultipleDomains = () => {
    dispatch(stopProcessingFile());
    dispatch(doUnsubmit());
    setMultipleDomainsInFile(false);
  };

  /**
   * Manage to change values from inputs in the state
   */
  const filterOnChange = (event) => {
    setInputValue(event.target.value);
  };

  /**
   * Send the file content to be ready to preview
   */
  const sendFileToPreview = (file) => {
    const reader = new FileReader();

    /**
     * When reading the file content
     */
    reader.onload = () => {
      /// Get the content of the file
      let content = reader.result;

      /// Get it into the specs list and put it on the previews
      let tempSpecs = previewSpecs;
      tempSpecs.push(content);
      dispatch(setSpecToPreview([]));
      dispatch(setSpecToPreview(tempSpecs));
    };

    /**
     * Update callback for errors
     */
    reader.onerror = function (e) {
      setErrors("File could not be read! Code: " + e.target.error.code);
    };

    reader.readAsText(file);
  };

  const formData = () => {
    return {
      name: name,
      version: version,
      useCase: useCase,
      domainId: selectedDomainId,
    };
  };

  /**
   * Unify the files by using the service
   * If we recognize more than 1 file uploaded by the user, we use the service to
   * merge the files into one big graph. And from now on, we manage to work with
   * the file content and not with the file object/s.
   *
   * Note that if there's only one file, nothing changes. The backend will just
   * return the file as its needed, and with the proper format to be processed here
   */
  const handleMergeFiles = async () => {
    let response = await mergeFiles(files);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    dispatch(setMergedFile(response.specification));

    files.map((file) => sendFileToPreview(file));

    return response.specification;
  };

  /**
   * Be sure that the uploaded file contains only one domain to map to
   */
  const handleCheckDomainsInFile = async (spec) => {
    let response = await checkDomainsInFile(spec);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    if (response.domains.length > 1) {
      setMultipleDomainsInFile(true);
      setDomainsInFile(response.domains);
      return;
    }
  };

  /**
   * Manage to work with only 1 file with all the information.
   */
  const processFiles = async () => {
    let spec = await handleMergeFiles();

    await handleCheckDomainsInFile(spec);
  };

  /**
   * Send the file/s to the API service to be parsed
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check the form validity
    if (errors) {
      toast.error("Please correct the errors first");
      event.preventDefault();
      return;
    }

    // Update the shared state
    dispatch(startProcessingFile());
    dispatch(setMappingFormData(formData()));

    // Manage file tasks with the service
    await processFiles();

    // Update the shared state
    dispatch(stopProcessingFile());
    dispatch(doSubmit());
  };

  /**
   * Filter the specification to have only those properties related to the
   * selected domain.
   *
   * @param {Array} uris: The uri's of the selected domains
   */
  const handleFilterSpecification = async (uris) => {
    let response = await filterSpecification(uris, mergedFile);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    dispatch(setVocabularies(response.filtered.vocabularies));

    return response.filtered.specification;
  };

  /**
   * When the user selects a domain from the ones recognized after parsing
   * the file, let's manage to grab it so we can send it to the api.
   *
   * Then filter the file content to only show the selected domain an
   * related properties.
   *
   * @param {Array} uris The list of identifiers of the rdfs:Class'es selected.
   */
  const onSelectDomainsFromFile = async (uris) => {
    dispatch(startProcessingFile());
    setMultipleDomainsInFile(false);

    let tempSpecs = [];
    let specification = await handleFilterSpecification(uris);
    dispatch(setMergedFile(specification));

    tempSpecs.push(JSON.stringify(specification, null, 2));

    dispatch(setSpecToPreview(tempSpecs));
    dispatch(stopProcessingFile());

    toast.info(
      "Great! You selected the following domains: " +
        uris.map((uri) => uri.toString()).join("\n")
    );
  };

  /**
   * File content to be displayed after
   * file upload is complete
   */
  const FileData = () => {
    let fileCards = [];

    if (files.length > 0) {
      files.map((file) => {
        fileCards.push(
          <FileInfo selectedFile={file} key={Date.now() + file.lastModified} />
        );
      });
    }

    return (
      <React.Fragment>
        <label>{files ? files.length : 0} files attached</label>
        {fileCards}
      </React.Fragment>
    );
  };

  /**
   * Fecth the domains to be listed in the new mapping form
   * then put it in the local sate
   */
  const fillWithDomains = () => {
    fetchDomains().then((response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }
      setDomains(response.domains);
      setSelectedDomainId(response.domains[0].id);
    });
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fillWithDomains'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    fillWithDomains();
  }, []);

  return (
    <React.Fragment>
      <MultipleDomainsModal
        domains={filteredDomainsInFile}
        inputValue={inputValue}
        modalIsOpen={multipleDomainsInFile}
        onRequestClose={unsetMultipleDomains}
        onSubmit={onSelectDomainsFromFile}
        onFilterChange={filterOnChange}
      />

      <div
        className={
          (submitted || processingFile ? "disabled-container " : " ") +
          "col-lg-6 p-lg-5 pt-5"
        }
      >
        {errors && <AlertNotice message={errors} />}

        <div className="mandatory-fields-notice">
          <small className="form-text text-muted">
            Fields with <span className="text-danger">*</span> are mandatory!
          </small>
        </div>

        <section>
          <h6 className="subtitle">1. Upload Your Specification</h6>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="specification_name">
                Name of your specification
              </label>
              <input
                type="text"
                name="name"
                id="specification_name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitted}
              />
              <small className="form-text text-muted">
                This is the name you will see in your list of mappings
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="version">Version</label>
              <input
                type="text"
                name="version"
                id="version"
                className="form-control"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
                disabled={submitted}
              />
            </div>
            <div className="form-group">
              <label htmlFor="useCase">Use Case</label>
              <input
                type="text"
                className="form-control"
                id="useCase"
                name="useCase"
                value={useCase}
                onBlur={handleUseCaseBlur}
                onChange={(e) => setUseCase(e.target.value)}
                disabled={submitted}
              />
              <small className="form-text text-muted">
                It must be a valid URL
              </small>
            </div>

            <div className="form-group">
              <label>Which domain are you uploading?</label>

              <div className="desm-radio">
                {domains.map(function (dom) {
                  return (
                    <div
                      className={
                        "desm-radio-primary" + (dom.spine ? " has-spine" : "")
                      }
                      key={dom.id}
                    >
                      <input
                        type="radio"
                        value={dom.id}
                        id={dom.id}
                        name="domain-options-form"
                        onChange={(e) => setSelectedDomainId(e.target.value)}
                        disabled={submitted}
                      />
                      <label htmlFor={dom.id}>{dom.name}</label>
                    </div>
                  );
                })}
              </div>

              <small className="mt-3 mb-3 float-right">
                Domains in <span className="badge badge-success">green</span>{" "}
                has a spine already uploaded
              </small>
            </div>
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="upload-help">
                    Upload
                  </span>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    className="file"
                    multiple
                    data-show-upload="true"
                    data-show-caption="true"
                    id="file-uploader"
                    aria-describedby="upload-help"
                    // accept=".rdf, .json, .jsonld, .xml"
                    accept=".json, .jsonld"
                    onChange={handleFileChange}
                    required={true}
                    disabled={submitted}
                  />
                  <label className="custom-file-label" htmlFor="file-uploader">
                    Attach File
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>
              <label className="mt-3">
                You can upload your specification as RDF, JSON, XML or JSONLD
                format
              </label>
            </div>

            <section>
              <button
                type="submit"
                className="btn btn-dark mt-3"
                disabled={submitted}
              >
                Import Specification
              </button>
            </section>
            <FileData />
          </form>
        </section>
      </div>
    </React.Fragment>
  );
};

export default MappingForm;
