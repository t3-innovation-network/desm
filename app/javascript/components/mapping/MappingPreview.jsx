import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  unsetFiles,
  unsetMergedFile,
  unsetSpecToPreview,
} from "../../actions/files";
import FileContent from "./FileContent";
import {
  doUnsubmit,
  startProcessingFile,
  stopProcessingFile,
} from "../../actions/mappingform";
import Loader from "./../shared/Loader";
import createSpec from "../../services/createSpec";
import { toastr as toast } from "react-redux-toastr";
import createMapping from "../../services/createMapping";
import { setVocabularies, unsetVocabularies } from "../../actions/vocabularies";
import createVocabulary from "../../services/createVocabulary";
import { vocabName } from "../../helpers/Vocabularies";
import UploadVocabulary from "../mapping-to-domains/UploadVocabulary";

const MappingPreview = (props) => {
  /**
   * Whether the form is submitted. This means all the fields are already filled, and the
   * file/s are uploaded. We can proceed with preview.
   */
  const submitted = useSelector((state) => state.submitted);
  /**
   * Whether we are processing the specification file. Used for filtering, seeking domains, and merging.
   */
  const processingFile = useSelector((state) => state.processingFile);
  /**
   * The specifcation contents ready to preview. THese are not the files object, but its contents
   * @todo: After the refactoring to merge the files to work with only one, this ahouls be only one file
   *    content, not a collection
   */
  const previewSpecs = useSelector((state) => state.previewSpecs);
  /**
   * The files content already merged. If its only one file, the same result.
   */
  const mergedFile = useSelector((state) => state.mergedFile);
  /**
   * The data to send when submitting in order to create the specification, vocabularies, and mapping if
   * necessary (if its the spine, no mapping will be created)
   */
  const mappingFormData = useSelector((state) => state.mappingFormData);
  /**
   * The vocabularies content ready to be printed. JSON format.
   */
  const vocabularies = useSelector((state) => state.vocabularies);
  /**
   * Flag to know whether we are creating the specification.
   */
  const [creatingSpec, setCreatingSpec] = useState(false);
  /**
   * Flag to know whether we are adding a new vocabulary.
   */
  const [addingVocabulary, setAddingVocabulary] = useState(false);
  /**
   * Flag to know whether we are crating the vocabularies.
   */
  const [creatingVocabularies, setCreatingVocabularies] = useState(false);
  /**
   * Redux statement to be able to change the store.
   */
  const dispatch = useDispatch();

  /**
   * Resets the files on redux global state, this way
   * The files collection is blanked and the use can re-import files
   */
  const handleOnReimport = () => {
    // Remove files from store
    dispatch(unsetFiles());
    // Remove previews
    dispatch(unsetSpecToPreview());
    // Change the form status to unsubmitted
    dispatch(doUnsubmit());
    // Remove unified file
    dispatch(unsetMergedFile());
    // Remove vocabularies
    dispatch(unsetVocabularies());
    // Reset the file uploader
    $("#file-uploader").val("");
  };

  /**
   * Create the specification using the api service
   */
  const handleCreateSpecification = async () => {
    setCreatingSpec(true);

    /// Send the specifications to the backend
    mappingFormData.specification = mergedFile;
    let response = await createSpec(mappingFormData);

    setCreatingSpec(false);

    /// Refresh store data
    dispatch(doUnsubmit());
    dispatch(unsetSpecToPreview());
    dispatch(unsetFiles());

    /// Manage errors
    if (response.error) {
      toast.error(response.error);
      return;
    }

    return response;
  };

  /**
   * Look for the vocabulary name, being the vocabulary an object conatining only
   * a grapha and a context.
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
   * @param {Object} vocab
   */
  const handleVocabularyAdded = (data) => {
    /// Manage the vocabularies in the store
    let tempVocabs = vocabularies;

    /// Add the new vocabulary
    tempVocabs.push(data.vocabulary.content);

    /// Refresh the UI
    dispatch(setVocabularies([]));
    dispatch(setVocabularies(tempVocabs));  };

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
      toast.error(response.error);
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
    /// Iterate thorugh all the vocabularies, creating one by one using the api service
    await Promise.all(
      vocabularies.map(async (vocab) => {
        /// Set the vocabulary name
        let vName = handleLookForVocabularyName(vocab);

        /// Do not continue if we didn't manage to get the vocabulary name, since this
        /// will generate an error in the backend.
        if (vName == "" || _.isUndefined(vName)) return;

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

    // if it's the spine, show a message to the user and return to home
    if (specResponse["spine?"]) {
      toast.success(
        "You created a spine for this domain: " + specResponse.domain.uri
      );
      props.redirect("/specifications/" + specResponse.id);
      return;
    }

    // If it's not the spine, the user is uploading a specification to map,
    // so let's create the mapping and (with the id returned) load the
    // mapping page
    dispatch(startProcessingFile());
    createMapping(specResponse.id).then((response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      dispatch(stopProcessingFile());
      props.redirect("/mappings/" + response.mapping.id);
    });
  };

  return (
    <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
      <React.Fragment>
        {processingFile ? (
          <Loader message="We're processing the file/s. Please wait ..." />
        ) : creatingVocabularies ? (
          <Loader message="We're processing vocabularies. Please wait ..." />
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
                        onClick={handleOnReimport}
                      >
                        Re-import
                      </button>
                      <button
                        className="btn bg-col-primary col-background ml-2"
                        disabled={creatingSpec || !previewSpecs.length}
                        onClick={handleLooksGood}
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
                <Loader message="We're processing the specification. Please wait ..." />
              ) : (
                <FileContent disabled={addingVocabulary}/>
              )}
            </React.Fragment>
          )
        )}
      </React.Fragment>
    </div>
  );
};

export default MappingPreview;
