import React, { useState, useEffect } from "react";
import validator from "validator";
import AlertNotice from "../shared/AlertNotice";
import FileInfo from "./FileInfo";
import { useSelector, useDispatch } from "react-redux";
import { setFiles, setSpecToPreview } from "../../actions/files";
import {
  doSubmit,
  startProcessingFile,
  stopProcessingFile,
  setMappingFormData,
} from "../../actions/mappingform";
import fetchDomains from "../../services/fetchDomains";
import { toastr as toast } from "react-redux-toastr";
import MultipleDomainsModal from "./MultipleDomainsModal";
import checkDomainsInFile from "../../services/checkDomainsInFile";
import filterSpecification from "../../services/filterSpecification";

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

  /// The selected domain to map from (read from the file)
  const [selectedDomainIdFromFile, setSelectedDomainIdFromFile] = useState(
    null
  );

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

  /// The preview files (files already prepared to be previewed, as
  /// without the unrelated domains and properties)
  const previewSpecs = useSelector((state) => state.previewSpecs);

  /// Whether the form was submitted or not, in order to show the preview
  const submitted = useSelector((state) => state.submitted);

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
    if (!validator.isURL(useCase)) {
      setErrors("'Use case' must be a valid URL");
    } else {
      setErrors("");
    }
  };

  /**
   * Set multiple domains flag to false
   */
  const unsetMultipleDomains = () => {
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
      domainTo: selectedDomainId,
    };
  };

  /**
   * Send the file/s to the API service to be parsed
   */
  const handleSubmit = (event) => {
    if (errors) {
      toast.error("Please correct the errors first");
      event.preventDefault();
      return;
    }

    dispatch(startProcessingFile());
    dispatch(setMappingFormData(formData()));

    /**
     * Be sure the file uploaded contains only one domain to map to
     */
    files.map(async (file) => {
      let response = await checkDomainsInFile(file);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.domains.length > 1) {
        setMultipleDomainsInFile(true);
        setDomainsInFile(response.domains);
        return;
      }

      dispatch(stopProcessingFile());
      sendFileToPreview(file);
    });

    dispatch(doSubmit());
    event.preventDefault();
  };

  /**
   * When the user selects a domain from the ones recognized after parsing
   * the file, let's manage to grab it so we can send it to the api.
   *
   * Then filter the file content to only show the selected domain an
   * related properties.
   */
  const onSelectDomainFromFile = (id) => {
    dispatch(startProcessingFile());
    setSelectedDomainIdFromFile(id);
    setMultipleDomainsInFile(false);

    let tempSpecs = [];
    files.map((file) => {
      filterSpecification(id, file).then((filteredSpecification) => {
        tempSpecs.push(JSON.stringify(filteredSpecification, null, 2));
        dispatch(setSpecToPreview(tempSpecs));
        dispatch(stopProcessingFile());
      });
    });

    toast.info("Great! You selected the domain with URI: " + id);
  };

  /**
   * File content to be displayed after
   * file upload is complete
   *
   * @returns {React.Fragment}
   */
  const fileData = () => {
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
        modalIsOpen={multipleDomainsInFile}
        onRequestClose={unsetMultipleDomains}
        domains={filteredDomainsInFile}
        onSelectDomain={onSelectDomainFromFile}
        filterOnChange={filterOnChange}
      />

      <div
        className={
          (submitted ? "disabled-container " : " ") + "col-lg-6 p-lg-5 pt-5"
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

            {fileData()}
          </form>
        </section>
      </div>
    </React.Fragment>
  );
};

export default MappingForm;
