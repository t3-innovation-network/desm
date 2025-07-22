import { useEffect } from 'react';
import { isNull, isUndefined } from 'lodash';
import FileInfo from './FileInfo';
import { useSelector, useDispatch } from 'react-redux';
import { useLocalStore } from 'easy-peasy';
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
import MultipleDomainsModal from './MultipleDomainsModal';
import checkDomainsInFile from '../../services/checkDomainsInFile';
import filterSpecification from '../../services/filterSpecification';
import mergeFiles from '../../services/mergeFiles';
import { setVocabularies } from '../../actions/vocabularies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { showError } from '../../helpers/Messages';
import { initFromMapping, mappingFormStore } from './stores/mappingFormStore';
import useDidMountEffect from '../../helpers/useDidMountEffect';
import { i18n } from '../../utils/i18n';

const MappingForm = ({ mapping = null }) => {
  const [state, actions] = useLocalStore(() => mappingFormStore(initFromMapping({}, mapping)));
  // The files uploaded by the user
  const files = useSelector((state) => state.files);
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
   * Whether we are processing the file or not
   */
  const processingFile = useSelector((state) => state.processingFile);
  /**
   * Whether the form was submitted or not, in order to show the preview
   */
  const submitted = useSelector((state) => state.submitted);
  const dispatch = useDispatch();
  const isNew = !mapping?.id;
  const i18key = `ui.mapping_upload.${isNew ? 'new' : 'persisted'}`;

  useDidMountEffect(() => {
    if (mapping?.specification) actions.updateDataFromMapping(mapping);
  }, [mapping?.specification?.id]);

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

    return !isUndefined(response.error);
  };

  /**
   * Set multiple domains flag to false
   */
  const unsetMultipleDomains = () => {
    dispatch(stopProcessingFile());
    dispatch(doUnsubmit());
    actions.setMultipleDomainsInFile(false);
  };

  /**
   * Manage to change values from inputs in the state
   */
  const filterOnChange = (event) => actions.setInputValue(event.target.value);

  const formData = () => {
    return {
      ...state.formData,
      mappingId: mapping.id,
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
        actions.setMultipleDomainsInFile(true);
        actions.setDomainsInFile(response.domains);
        return;
      }

      await onSelectDomainsFromFile([response.domains[0].uri], mergedFileId);
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
  const handleFilterSpecification = async (uris, fileId = null) => {
    let response = await filterSpecification(uris, fileId || mergedFileId);

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
  const onSelectDomainsFromFile = async (uris, fileId = null) => {
    dispatch(startProcessingFile());
    actions.setMultipleDomainsInFile(false);

    const data = { ...formData(), ...mappingFormData, selectedDomains: uris };
    dispatch(setMappingFormData(data));

    let tempSpecs = [];
    let specification = await handleFilterSpecification(uris, fileId);

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
        <label className="form-label">{files ? files.length : 0} files attached</label>
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
        actions.setDomains(response.domains);
      }
    });
  };

  /**
   * Use effect with an empty array as second parameter, will trigger the 'fillWithDomains'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    if (isNew) fillWithDomains();
    dispatch(setFiles([]));
    dispatch(unsetMappingFormErrors());
    unsetMultipleDomains();
  }, []);

  return (
    <>
      <MultipleDomainsModal
        domains={state.filteredDomainsInFile}
        inputValue={state.inputValue}
        modalIsOpen={state.multipleDomainsInFile}
        onRequestClose={unsetMultipleDomains}
        onSubmit={onSelectDomainsFromFile}
        onFilterChange={filterOnChange}
      />

      <div
        className={
          (submitted || processingFile ? 'disabled-container ' : ' ') +
          'col-lg-6 p-lg-5 pt-5 position-relative'
        }
      >
        <div className="mandatory-fields-notice">
          <small className="form-text text-body-secondary">
            Fields with <span className="text-danger">*</span> are mandatory!
          </small>
        </div>

        <section>
          <h6 className="subtitle">{i18n.t(`${i18key}.step_1`)}</h6>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label required" htmlFor="specification_name">
                Name of your specification
              </label>
              <input
                type="text"
                name="name"
                id="specification_name"
                className="form-control"
                value={state.name}
                onChange={(e) => actions.setName(e.target.value)}
                required
                disabled={submitted}
              />
              <small className="form-text text-body-secondary">
                This is the name you will see in your list of mappings
              </small>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="version">
                Version
              </label>
              <input
                type="text"
                name="version"
                id="version"
                className="form-control"
                value={state.version}
                onChange={(e) => actions.setVersion(e.target.value)}
                disabled={submitted}
              />
            </div>

            <div className="form-group">
              {isNew ? (
                <>
                  <label className="form-label required">{i18n.t(`${i18key}.form.domain`)}</label>

                  <div className="desm-radio">
                    {state.domains.map((domain) => (
                      <div className="desm-radio-primary" key={domain.id}>
                        <input
                          disabled={submitted}
                          id={domain.id}
                          name="domain-options-form"
                          onChange={(e) => actions.setSelectedDomainId(e.target.value)}
                          required
                          type="radio"
                          value={domain.id}
                        />
                        <label
                          className={`form-label ${domain.spine ? 'text-success' : ''}`}
                          htmlFor={domain.id}
                        >
                          <strong>{domain.name}</strong>
                        </label>
                      </div>
                    ))}
                  </div>

                  {isNull(state.selectedDomainId) &&
                    Boolean(files.length) &&
                    !submitted &&
                    !processingFile && (
                      <span style={{ color: 'red' }}>
                        Please select an abstract class from the list ☝️{' '}
                      </span>
                    )}
                </>
              ) : (
                <>
                  <label className="form-label">{i18n.t(`${i18key}.form.domain`)}</label>
                  <input
                    className={`form-control ${state.selectedDomain?.spine ? 'text-success' : ''}`}
                    value={state.selectedDomain?.name || ''}
                    readOnly
                  />
                </>
              )}

              <small className="mb-3">
                Abstract classes in <span className="badge bg-success">green</span> have a spine
                already uploaded
              </small>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-text" id="upload-help">
                  Upload
                </span>
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
                    <span className="text-danger align-top"> *</span>
                  </label>
                </div>
              </div>
              <label className="mt-3">
                You can upload your specification as RDF (Turtle, JSON-LD or RDF/XML), JSON Schema,
                XML Schema (XSD), or CSV.
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
