import { useState, useEffect } from 'react';
import FileInfo from './FileInfo';
import { useSelector, useDispatch } from 'react-redux';
import { setFiles, setFilteredFile, setMergedFileId, setSpecToPreview } from '../../actions/files';
import {
  doSubmit,
  startProcessingFile,
  stopProcessingFile,
  setMappingFormData,
  doUnsubmit,
  setMappingFormErrors,
  unsetMappingFormErrors,
} from '../../actions/mappingform';
import fetchDomains from '../../services/fetchDomains';
import fetchMergedFile from '../../services/fetchMergedFile';
import MultipleDomainsModal from './MultipleDomainsModal';
import checkDomainsInFile from '../../services/checkDomainsInFile';
import filterSpecification from '../../services/filterSpecification';
import mergeFiles from '../../services/mergeFiles';
import { setVocabularies } from '../../actions/vocabularies';
import { validURL } from '../../helpers/URL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { showError } from '../../helpers/Messages';

const MappingForm = () => {
  /**
   * The list  of domains (from the skos file)
   */
  const [domains, setDomains] = useState([]);
  /**
   * Which domains were found in the uploaded file (the api parses
   * the file to get to it)
   */
  const [domainsInFile, setDomainsInFile] = useState([]);
  /**
   * The files uploaded by the user
   */
  const files = useSelector((state) => state.files);
  /**
   * The value of the input that the user is typing in the search box
   * when there are many domains in the uploaded file
   */
  const [inputValue, setInputValue] = useState('');
  /**
   * The domains that includes the string typed by the user in the
   * search box when there are many domains in the uploaded file
   */
  const filteredDomainsInFile = domainsInFile.filter((domain) => {
    return domain.label.toLowerCase().includes(inputValue.toLowerCase());
  });
  /**
   * The data to send when submitting in order to create the specification, vocabularies, and mapping if
   * necessary (if its the spine, no mapping will be created)
   */
  const mappingFormData = useSelector((state) => state.mappingFormData);
  /**
   * The errors in the mapping form across different components
   */
  const mappingFormErrors = useSelector((state) => state.mappingFormErrors);
  /**
   * The unified file from the ones the user uploaded
   */
  const mergedFileId = useSelector((state) => state.mergedFileId);
  /**
   * Whether there's more than one domain found in the uploaded file
   */
  const [multipleDomainsInFile, setMultipleDomainsInFile] = useState(false);
  /**
   * Name of the specification
   */
  const [name, setName] = useState('');
  /**
   * Whether we are processing the file or not
   */
  const processingFile = useSelector((state) => state.processingFile);
  /**
   * The selected domain to map to
   */
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  /**
   * Whether the form was submitted or not, in order to show the preview
   */
  const submitted = useSelector((state) => state.submitted);
  /**
   * Use case for this specification
   */
  const [useCase, setUseCase] = useState('');
  /**
   * Version of this specification
   */
  const [version, setVersion] = useState('');
  const dispatch = useDispatch();

  /**
   * Update the files in the redux store (main application state) when
   * the input changes (after the user selects file/s)
   */
  const handleFileChange = (event) => {
    dispatch(setFiles(Array.from(event.target.files)));
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  const anyError = (response) => {
    if (response.error) {
      dispatch(setMappingFormErrors([response.error]));
    } else {
      dispatch(unsetMappingFormErrors());
    }

    return !_.isUndefined(response.error);
  };

  /**
   * Validates the use case to be a valid URL after the user focuses
   * out the "use case" input
   */
  const handleUseCaseBlur = () => {
    if (!_.isEmpty(useCase) && !validURL(useCase)) {
      dispatch(setMappingFormErrors(["'Use case' must be a valid URL"]));
    } else {
      dispatch(unsetMappingFormErrors());
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

  const formData = () => {
    return {
      name: name,
      version: version,
      useCase: useCase,
      domainId: selectedDomainId,
      /// Set the file name to send to the service. This will appear as "scheme" in all
      /// further properties created.
      scheme: files[0].name,
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
    const { error, mergedFileId } = await mergeFiles(files);

    if (mergedFileId) {
      dispatch(setMergedFileId(mergedFileId));
      return mergedFileId;
    }

    error && dispatch(setMappingFormErrors([error]));
  };

  /**
   * Be sure that the uploaded file contains only one domain to map to
   *
   * @param {Integer} mergedFileId
   */
  const handleCheckDomainsInFile = async (mergedFileId) => {
    let response = await checkDomainsInFile(mergedFileId);

    if (!anyError(response)) {
      if (!response.domains.length) {
        dispatch(setMappingFormErrors(["We couldn't find any classes in the provided file"]));
        return;
      }

      if (response.domains.length > 1) {
        setMultipleDomainsInFile(true);
        setDomainsInFile(response.domains);
        return;
      }
    }

    await previewSingleDomainFile(mergedFileId);
  };

  /**
   * The uploaded file is a single domain file. Let's just get the content and show in preview
   *
   * @param {int} mergedFileId
   */
  const previewSingleDomainFile = async (mergedFileId) => {
    let response = await fetchMergedFile(mergedFileId);

    if (!anyError(response)) {
      let tempSpecs = [];
      tempSpecs.push(JSON.stringify(response.mergedFile, null, 2));

      dispatch(setSpecToPreview(tempSpecs));
      dispatch(setFilteredFile(response.mergedFile));
    }
  };

  /**
   * Manage to work with only 1 file with all the information.
   */
  const processFiles = async () => {
    const mergedFileId = await handleMergeFiles();

    if (mergedFileId) {
      await handleCheckDomainsInFile(mergedFileId);
    }
  };

  /**
   * Send the file/s to the API service to be parsed
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check the form validity
    if (mappingFormErrors.length) {
      showError('Please correct the errors first');
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
    let response = await filterSpecification(uris, mergedFileId);

    if (!anyError(response)) {
      dispatch(setVocabularies(response.filtered.vocabularies));
      dispatch(setFilteredFile(response.filtered.specification));

      return response.filtered.specification;
    }
  };

  /**
   * When the user selects a domain from the ones recognized after parsing
   * the file, let's manage to grab it so we can send it to the api.
   *
   * Then filter the file content to only show the selected domain an
   * related properties.
   *
   * @param {Array} uris The list of identifiers of the rdfs:Class(es) selected.
   */
  const onSelectDomainsFromFile = async (uris) => {
    dispatch(startProcessingFile());
    setMultipleDomainsInFile(false);

    mappingFormData.selectedDomains = uris;
    dispatch(setMappingFormData(mappingFormData));

    let tempSpecs = [];
    let specification = await handleFilterSpecification(uris);

    tempSpecs.push(JSON.stringify(specification, null, 2));

    dispatch(setSpecToPreview(tempSpecs));
    dispatch(stopProcessingFile());
  };

  /**
   * File content to be displayed after
   * file upload is complete
   */
  const FileData = () => {
    let fileCards = [];

    if (files.length > 0) {
      files.map((file) => {
        fileCards.push(<FileInfo selectedFile={file} key={Date.now() + file.lastModified} />);
      });
    }

    return (
      <>
        <label>{files ? files.length : 0} files attached</label>
        {fileCards}
      </>
    );
  };

  /**
   * Fetch the domains to be listed in the new mapping form
   * then put it in the local sate
   */
  const fillWithDomains = () => {
    fetchDomains().then((response) => {
      if (!anyError(response)) {
        setDomains(response.domains);
      }
    });
  };

  /**
   * Use effect with an empty array as second parameter, will trigger the 'fillWithDomains'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    fillWithDomains();
    dispatch(setFiles([]));
    dispatch(unsetMappingFormErrors());
    unsetMultipleDomains();
  }, []);

  return (
    <>
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
          (submitted || processingFile ? 'disabled-container ' : ' ') + 'col-lg-6 p-lg-5 pt-5'
        }
      >
        <div className="mandatory-fields-notice">
          <small className="form-text text-muted">
            Fields with <span className="text-danger">*</span> are mandatory!
          </small>
        </div>

        <section>
          <h6 className="subtitle">1. Upload Your Specification</h6>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="specification_name">Name of your specification</label>
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
              <small className="form-text text-muted">It must be a valid URL</small>
            </div>

            <div className="form-group">
              <label>Which domain are you uploading?</label>

              <div className="desm-radio">
                {domains.map((domain) => (
                  <div className="desm-radio-primary" key={domain.id}>
                    <input
                      disabled={submitted}
                      id={domain.id}
                      name="domain-options-form"
                      onChange={(e) => setSelectedDomainId(e.target.value)}
                      required
                      type="radio"
                      value={domain.id}
                    />
                    <label
                      className={domain.spine ? 'text-success' : undefined}
                      htmlFor={domain.id}
                    >
                      <strong>{domain.name}</strong>
                    </label>
                  </div>
                ))}
              </div>

              {_.isNull(selectedDomainId) &&
                Boolean(files.length) &&
                !submitted &&
                !processingFile && (
                  <span style={{ color: 'red' }}>Please select a domain from the list ☝️ </span>
                )}

              <small className="mb-3">
                Domains in <span className="badge badge-success">green</span> have a spine already
                uploaded
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
                    accept=".csv, .json, .jsonld, .nt, .rdf, .ttl, .xml, .xsd, .zip"
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
                You can upload your specification as CSV, JSON-LD, JSON Schema, RDF, or XML format
              </label>
              {Boolean(files.length) && !submitted && !processingFile && (
                <section>
                  <button
                    className="btn bg-col-primary col-background with-shadow floating-spec-btn mt-3"
                    disabled={submitted}
                    title="Import the specification"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="col-background" />
                  </button>
                </section>
              )}
            </div>

            <FileData />
          </form>
        </section>
      </div>
    </>
  );
};

export default MappingForm;
