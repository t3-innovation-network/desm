import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isUndefined } from 'lodash';
import {
  unsetFiles,
  unsetFilteredFile,
  unsetMergedFileId,
  unsetSpecToPreview,
} from '../../actions/files';
import SpecsPreviewList from './SpecsPreviewList';
import {
  doUnsubmit,
  setMappingFormErrors,
  startProcessingFile,
  stopProcessingFile,
  unsetMappingFormErrors,
} from '../../actions/mappingform';
import Loader from './../shared/Loader';
import createSpec from '../../services/createSpec';
import updateSpec from '../../services/updateSpec';
import createMapping from '../../services/createMapping';
import { setVocabularies, unsetVocabularies } from '../../actions/vocabularies';
import createVocabulary from '../../services/createVocabulary';
import { vocabName } from '../../helpers/Vocabularies';
import UploadVocabulary from '../mapping-to-domains/UploadVocabulary';
import Pluralize from 'pluralize';
import extractVocabularies from '../../services/extractVocabularies';
import { showError, showSuccess, showWarning } from '../../helpers/Messages';
import { pageRoutes } from '../../services/pageRoutes';
import { i18n } from '../../utils/i18n';

const MappingPreview = (props) => {
  const { mapping } = props;
  /**
   * Flag to know whether we are adding a new vocabulary.
   */
  const [addingVocabulary, setAddingVocabulary] = useState(false);
  /**
   * Flag to know whether we are creating the specification.
   */
  const [creatingSpec, setCreatingSpec] = useState(false);
  /**
   * Flag to know whether we are crating the vocabularies.
   */
  const [creatingVocabularies, setCreatingVocabularies] = useState(false);
  /**
   * Redux statement to be able to change the store.
   */
  const dispatch = useDispatch();
  /**
   * The files uploaded by the user.
   */
  const files = useSelector((state) => state.files);
  /**
   * The data to send when submitting in order to create the specification, vocabularies, and mapping if
   * necessary (if its the spine, no mapping will be created)
   */
  const mappingFormData = useSelector((state) => state.mappingFormData);
  /**
   * The files content already merged. If its only one file, the same result.
   */
  const filteredFile = useSelector((state) => state.filteredFile);
  /**
   * Whether we are processing the specification file. Used for filtering, seeking domains, and merging.
   */
  const processingFile = useSelector((state) => state.processingFile);
  /**
   * Gives the amount of properties found in the specification
   */
  const propertiesCount = (filteredFile['@graph'] || []).filter((r) =>
    /rdfs?:Property/.test(r['@type'])
  ).length;
  /**
   * Whether the form is submitted. This means all the fields are already filled, and the
   * file/s are uploaded. We can proceed with preview.
   */
  const submitted = useSelector((state) => state.submitted);
  /**
   * The vocabularies content ready to be printed. JSON format.
   */
  const vocabularies = useSelector((state) => state.vocabularies);

  /**
   * Determines whether there are errors in the form
   *
   * @param {HttpResponse} response
   */
  const anyError = (response) => {
    if (response.error) {
      dispatch(setMappingFormErrors([response.error]));
    }

    return !isUndefined(response.error);
  };

  /**
   * Resets the files on redux global state, this way
   * The files collection is blanked and the use can re-import files
   */
  const unsetFormValues = () => {
    /// Remove files from store
    dispatch(unsetFiles());
    /// Remove previews
    dispatch(unsetSpecToPreview());
    /// Change the form status to not submitted
    dispatch(doUnsubmit());
    /// Remove unified file
    dispatch(unsetMergedFileId());
    /// Remove vocabularies
    dispatch(unsetVocabularies());
    /// Reset errors
    dispatch(unsetMappingFormErrors());
    /// Reset errors
    dispatch(unsetFilteredFile());

    /// Reset the file uploader
    let fileUploader = document.getElementById('file-uploader');
    if (fileUploader) fileUploader.value = '';
  };

  /**
   * Create the specification using the api service
   */
  const handleCreateSpecification = async () => {
    setCreatingSpec(true);

    /// Send the specifications to the backend
    mappingFormData.content = JSON.stringify(filteredFile);
    let response = await (mapping?.id ? updateSpec(mappingFormData) : createSpec(mappingFormData));

    setCreatingSpec(false);

    /// Refresh store data
    dispatch(doUnsubmit());
    dispatch(unsetSpecToPreview());
    dispatch(unsetFiles());

    /// Manage errors
    if (!anyError(response)) {
      return response;
    }
  };

  /**
   * Look for the vocabulary name, being the vocabulary an object containing only
   * a graph and a context.
   *
   * @param {Object} vocab
   */
  const handleLookForVocabularyName = (vocab) => {
    try {
      return vocabName(vocab);
    } catch (error) {
      showError(error);
      return '';
    }
  };

  /**
   * Actions after the vocabulary was successfully added into the api service
   *
   * @param {Object} data
   */
  const handleVocabularyAdded = async (data) => {
    const response = await extractVocabularies(data);
    if (!response.error) {
      // select vocabularies from the response that were already in the store
      const existingVocabularies = response.vocabularies.filter((v) =>
        vocabularies.some((existingVocab) => vocabName(existingVocab) === vocabName(v))
      );
      response.vocabularies.forEach((vocab) => {
        // find vocabularies with the same name and get maximum version + 1
        const existingVocabs = vocabularies.filter((v) => vocabName(v) === vocabName(vocab));
        if (existingVocabs.length > 0) {
          const maxVersion = Math.max(...existingVocabs.map((v) => v.version));
          vocab.version = maxVersion + 1;
        }
      });
      dispatch(setVocabularies([...vocabularies, ...response.vocabularies]));
      // if any existing vocabulary was found, show a error message
      if (existingVocabularies.length > 0) {
        dispatch(
          setMappingFormErrors([
            'The following controlled vocabularies were already added and will be added with version number on saving: ' +
              existingVocabularies.map((v) => vocabName(v)).join(', '),
          ])
        );
      }
    }
    return response;
  };

  /**
   * Create all the vocabularies
   */
  const handleCreateVocabularies = async () => {
    let countCreated = 0,
      countUpdated = 0,
      updateVocabularies = [];

    setCreatingVocabularies(true);
    /// Iterate through all the vocabularies, creating one by one using the api service
    await Promise.all(
      vocabularies.map(async (vocab) => {
        /// Set the vocabulary name
        let vName = handleLookForVocabularyName(vocab);

        /// Do not continue if we didn't manage to get the vocabulary name, since this
        /// will generate an error in the backend.
        if (vName === '' || isUndefined(vName)) return;

        const response = await createVocabulary({
          vocabulary: {
            name: vName,
            content: vocab,
          },
        });
        if (!response.error) {
          if (response.vocabulary.version === 1) {
            countCreated++;
          } else {
            countUpdated++;
            updateVocabularies.push({
              name: response.vocabulary.name,
              version: response.vocabulary.version,
              name_with_version: response.vocabulary.name_with_version,
            });
          }
        }
      })
    );
    setCreatingVocabularies(false);

    const countSaved = countCreated + countUpdated;
    if (countSaved && countUpdated === 0) {
      showSuccess(i18n.t('ui.mapping.vocabularies.created', { count: countSaved }));
    } else if (countUpdated > 0) {
      const messageProcessed = i18n.t('ui.mapping.vocabularies.created', { count: countSaved });
      const messageUpdated = i18n.t('ui.mapping.vocabularies.updated', {
        count: countUpdated,
        name: updateVocabularies.map((v) => `"${v.name}"`).join(', '),
        new_name: updateVocabularies.map((v) => `"${v.name_with_version}"`).join(', '),
      });
      showWarning(`${messageProcessed} ${messageUpdated}`);
    }
  };

  /**
   * Call the api to create a specification with the data in the store
   */
  const handleLooksGood = async () => {
    let specResponse = await handleCreateSpecification();
    await handleCreateVocabularies();

    let response;
    // new mapping
    if (!mapping?.id) {
      // If it's not the spine, the user is uploading a specification to map,
      // so let's create the mapping and (with the id returned) load the
      // mapping page
      dispatch(startProcessingFile());

      response = await createMapping(specResponse.id);
      dispatch(stopProcessingFile());

      if (response.error) {
        showError(response.error);
        return;
      }
    }

    unsetFormValues();
    props.redirect(pageRoutes.mappingUploaded(mapping?.id || response.mapping.id));
  };

  return (
    <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
      <>
        {processingFile ? (
          <Loader
            message={
              "We're processing the " +
              Pluralize('file', files.length) +
              '. Please wait, this might take a while ...'
            }
            showImage={true}
          />
        ) : creatingVocabularies ? (
          <Loader
            message="We're processing controlled vocabularies. Please wait, this might take a while ..."
            showImage={true}
          />
        ) : (
          submitted && (
            <>
              <div className="card mb-5">
                <div className="card-header">
                  <div className="row">
                    <div className="col-6 align-self-center">
                      <strong>Preview your upload</strong>
                    </div>
                    <div className="col-6 text-end">
                      <button className="btn btn-dark" onClick={unsetFormValues}>
                        Re-import
                      </button>
                      <button
                        className="btn bg-col-primary col-background ms-2"
                        disabled={creatingSpec || !filteredFile || !propertiesCount}
                        onClick={handleLooksGood}
                        title={
                          !propertiesCount
                            ? 'No properties/elements were found in the uploaded file/s. Please review it an try again'
                            : 'Create the specification'
                        }
                      >
                        Looks Good
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label
                    className="col-primary cursor-pointer float-end"
                    title="Add a new controlled vocabulary"
                    onClick={() => setAddingVocabulary(true)}
                  >
                    Add Controlled Vocabulary
                  </label>
                </div>
              </div>

              {addingVocabulary ? (
                <UploadVocabulary
                  onVocabularyAdded={handleVocabularyAdded}
                  onRequestClose={() => setAddingVocabulary(false)}
                />
              ) : (
                ''
              )}

              {creatingSpec ? (
                <Loader
                  message="We're processing the specification. Please wait, this might take a while ..."
                  showImage={true}
                />
              ) : (
                <SpecsPreviewList disabled={addingVocabulary} propertiesCount={propertiesCount} />
              )}
            </>
          )
        )}
      </>
    </div>
  );
};

export default MappingPreview;
