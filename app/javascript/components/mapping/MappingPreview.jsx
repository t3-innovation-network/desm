import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  unsetFiles,
  unsetFilteredFile,
  unsetMergedFileId,
  unsetSpecToPreview,
} from "../../actions/files";
import SpecsPreviewTabs from "./SpecsPreviewTabs";
import {
  doUnsubmit,
  setMappingFormErrors,
  startProcessingFile,
  stopProcessingFile,
  unsetMappingFormErrors,
} from "../../actions/mappingform";
import Loader from "./../shared/Loader";
import createSpec from "../../services/createSpec";
import { toastr as toast } from "react-redux-toastr";
import createMapping from "../../services/createMapping";
import { setVocabularies, unsetVocabularies } from "../../actions/vocabularies";
import createVocabulary from "../../services/createVocabulary";
import { vocabName } from "../../helpers/Vocabularies";
import UploadVocabulary from "../mapping-to-domains/UploadVocabulary";
import Pluralize from "pluralize";

const MappingPreview = (props) => {
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
  const propertiesCount =
    (filteredFile["@graph"]?.length || 0) -
    (mappingFormData?.selectedDomains?.length || 0);
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

    return !_.isUndefined(response.error);
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
    $("#file-uploader").val("");
  };

  /**
   * Create the specification using the api service
   */
  const handleCreateSpecification = async () => {
    setCreatingSpec(true);

    /// Send the specifications to the backend
    mappingFormData.content = JSON.stringify(filteredFile);
    let response = await createSpec(mappingFormData);

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
      return vocabName(vocab["@graph"]);
    } catch (error) {
      toast.error(error);
      return "";
    }
  };

  /**
   * Actions after the vocabulary was successfully added into the api service
   *
   * @param {Object} data
   */
  const handleVocabularyAdded = (data) => {
    /// Manage the vocabularies in the store
    let tempVocabs = vocabularies;

    /// Add the new vocabulary
    tempVocabs.push(data.vocabulary.content);

    /// Refresh the UI
    dispatch(setVocabularies([]));
    dispatch(setVocabularies(tempVocabs));
  };

  /**
   * Use the api service to create one only vocabulary.
   *
   * @param {String} name The name for the vocabulary
   * @param {Object} content The JSON structured content for the vocabulary
   */
  const handleSaveOneVocabulary = async (name, content) => {
    let response = await createVocabulary({
      vocabulary: {
        name: name,
        content: content,
      },
    });

    if (response.error) {
      return false;
    }

    return true;
  };

  /**
   * Create all the vocabularies
   */
  const handleCreateVocabularies = async () => {
    let cantSaved = 0;

    setCreatingVocabularies(true);
    /// Iterate through all the vocabularies, creating one by one using the api service
    await Promise.all(
      vocabularies.map(async (vocab) => {
        /// Set the vocabulary name
        let vName = handleLookForVocabularyName(vocab);

        /// Do not continue if we didn't manage to get the vocabulary name, since this
        /// will generate an error in the backend.
        if (vName === "" || _.isUndefined(vName)) return;

        if (await handleSaveOneVocabulary(vName, vocab)) {
          cantSaved++;
        }
      })
    );
    setCreatingVocabularies(false);

    if (cantSaved) toast.success(cantSaved + " vocabularies processed.");
  };

  /**
   * Call the api to create a specification with the data in the store
   */
  const handleLooksGood = async () => {
    let specResponse = await handleCreateSpecification();
    await handleCreateVocabularies();

    // If it's not the spine, the user is uploading a specification to map,
    // so let's create the mapping and (with the id returned) load the
    // mapping page
    dispatch(startProcessingFile());
    createMapping(specResponse.id).then((response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      unsetFormValues();
      props.redirect("/mappings/" + response.mapping.id);
    });
  };

  return (
    <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
      <React.Fragment>
        {processingFile ? (
          <Loader
            message={
              "We're processing the " +
              Pluralize("file", files.length) +
              ". Please wait, this might take a while ..."
            }
            showImage={true}
          />
        ) : creatingVocabularies ? (
          <Loader
            message="We're processing vocabularies. Please wait, this might take a while ..."
            showImage={true}
          />
        ) : (
          submitted && (
            <React.Fragment>
              <div className="card mb-5">
                <div className="card-header">
                  <div className="row">
                    <div className="col-6 align-self-center">
                      <strong>Preview your upload</strong>
                    </div>
                    <div className="col-6 text-right">
                      <button
                        className="btn btn-dark"
                        onClick={unsetFormValues}
                      >
                        Re-import
                      </button>
                      <button
                        className="btn bg-col-primary col-background ml-2"
                        disabled={
                          creatingSpec || !filteredFile || !propertiesCount
                        }
                        onClick={handleLooksGood}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={
                          !propertiesCount
                            ? "No properties were found in the uploaded file/s. Please review it an try again"
                            : "Create the specification"
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
                    className="col-primary cursor-pointer float-right"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Add a new vocabulary"
                    onClick={() => setAddingVocabulary(true)}
                  >
                    Add Vocabulary
                  </label>
                </div>
              </div>

              {addingVocabulary ? (
                <UploadVocabulary
                  onVocabularyAdded={handleVocabularyAdded}
                  onRequestClose={() => setAddingVocabulary(false)}
                />
              ) : (
                ""
              )}

              {creatingSpec ? (
                <Loader
                  message="We're processing the specification. Please wait, this might take a while ..."
                  showImage={true}
                />
              ) : (
                <SpecsPreviewTabs
                  disabled={addingVocabulary}
                  propertiesCount={propertiesCount}
                />
              )}
            </React.Fragment>
          )
        )}
      </React.Fragment>
    </div>
  );
};

export default MappingPreview;
