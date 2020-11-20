import React, { Fragment, useEffect, useState } from "react";
import FileInfo from "../mapping/FileInfo";
import {
  validVocabulary,
  vocabName,
  cantConcepts,
} from "../../helpers/Vocabularies";
import AlertNotice from "../shared/AlertNotice";
import fetchExternalVocabulary from "./../../services/fetchExternalVocabulary";
import { validURL } from "../../helpers/URL";

var isJSON = require("is-valid-json");

const UploadVocabulary = (props) => {
  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);
  /**
   * Represents the available types of fetching a vocabulary
   */
  const uploadModes = {
    FILE_UPLOAD: "file-upload",
    FETCH_BY_URL: "fetch-by-url",
  };
  /**
   * The current upload mode
   */
  const [uploadMode, setUploadMode] = useState(uploadModes.FILE_UPLOAD);
  /**
   * The uploaded file which will contain the specification of
   * a vocabulary in a concept scheme json-ld format
   */
  const [file, setFile] = useState(null);
  /**
   * The content of the file. Set after reading it with a "FileReader"
   */
  const [fileContent, setFileContent] = useState("");
  /**
   * Name for the vocabulary
   */
  const [name, setName] = useState("");

  /**
   * URL to fetch the vocabulary from
   */
  const [vocabularyURL, setVocabularyURL] = useState("");

  /**
   * The vocabulary that's fetched using an external URL
   */
  const [fetchedVocabulary, setFetchedVocabulary] = useState({});

  /**
   * The name of the vocabulary that's fetched using an external URL
   */
  const [fetchedVocabularyName, setFetchedVocabularyName] = useState("");

  /**
   * Update the files in the redux store (main application state) when
   * the input changes (after the user selects file/s)
   */
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  /**
   * After the sate of the file is changed, read it if there's any valid
   * file
   */
  useEffect(() => {
    if (file != null) {
      readFileContent();
    }
  }, [file]);

  /**
   * File content to be displayed after
   * file upload is complete
   *
   * @returns {React.Fragment}
   */
  const FileData = () => {
    return file != null ? (
      <FileInfo selectedFile={file} key={Date.now() + file.lastModified} />
    ) : (
      ""
    );
  };

  /**
   * Transform the file content to be able to send it to the backend
   */
  const readFileContent = () => {
    const reader = new FileReader();

    /**
     * When reading the file content
     */
    reader.onload = () => {
      /// Get the content of the file
      let content = reader.result;
      setFileContent(content);
    };

    /**
     * Update callback for errors
     */
    reader.onerror = function (e) {
      let tempErrors = errors;
      tempErrors.push("File could not be read! Code: " + e.target.error.code);
      setErrors(tempErrors);
    };

    reader.readAsText(file);
  };

  /**
   * Fetch the vocabulary from the provided URL
   */
  const handleVocabularyURLBlur = () => {
    if (!validURL(vocabularyURL)) {
      setErrors(["It must be a valid URL"]);
      return;
    }
    setErrors([]);
  };

  /**
   * Manages to corroborate that the file content is a valid JSON
   *
   * @param {String} content
   */
  const isValidJson = (content) => {
    let isValid = isJSON(content);

    if (!isValid) {
      setErrors([
        "Invalid JSON!\nBe sure to validate the file before uploading",
      ]);
    }

    return isValid;
  };

  /**
   * Fetch the vocabulary from the provided URL
   */
  const handleFetchVocabulary = async () => {
    let response = await fetchExternalVocabulary(vocabularyURL);

    if (response.error) {
      setErrors([response.error]);
      return;
    }

    if (isValidJson(response.vocabulary)) {
      setFetchedVocabulary(response.vocabulary);
      handleSetFetchedVocabularyName(response.vocabulary);
    }
  };

  /**
   * Safely try to get the vocabulary name
   */
  const handleSetFetchedVocabularyName = (vocab) => {
    let name = "";
    try {
      name = vocabName(vocab["@graph"]);
      setFetchedVocabularyName(name);
    } catch (e) {
      setErrors([e]);
    }
  };

  /**
   * Returns the number of conepts recognized inside the fetched vocabulary
   *
   * @returns {Integer}
   */
  const handleFetchedVocabularyCantConcepts = () => {
    if (!_.isEmpty(fetchedVocabulary)) {
      return cantConcepts(fetchedVocabulary);
    }

    return 0;
  };

  /**
   * Determines the vocabulary validity
   *
   * @param {Object} vocab
   */
  const handleVocabularyValidity = (vocab) => {
    setErrors([]);
    let validity = validVocabulary(vocab);

    if (!_.isEmpty(validity.errors)) {
      setErrors(validity.errors);
    }

    return validity.result;
  };

  /**
   * Generates the content for the vocabulary to be submitted
   * Case 1: The vocabulary was submitted using a file from the filesystem
   * Case 2: The vocabulary was uploaded by using a service by HTTP (an external URL)
   */
  const vocabularyToSubmit = () => {
    switch (uploadMode) {
      case uploadModes.FETCH_BY_URL:
        return fetchedVocabulary;
      case uploadModes.FILE_UPLOAD:
        return JSON.parse(fileContent);
    }
  };

  /**
   * Send the file with the vocabulary to the backend
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    let vocab = vocabularyToSubmit();

    if (handleVocabularyValidity(vocab)) {
      props.onVocabularyAdded({
        vocabulary: {
          name: name,
          content: vocab,
        },
      });

      props.onRequestClose();
    }
  };

  /**
   * Structure of the form to upload a vocabulary from the filesystem
   */
  const FileUploadForm = () => {
    return (
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
              data-show-upload="true"
              data-show-caption="true"
              id="file-vocab-uploader"
              aria-describedby="upload-help"
              accept=".json, .jsonld"
              onChange={handleFileChange}
            />
            <label className="custom-file-label" htmlFor="file-vocab-uploader">
              Attach File
              <span className="text-danger">*</span>
            </label>
          </div>
        </div>
        <small className="mt-5">
          You can upload your concept scheme file in JSONLD format (skos file)
        </small>
        <div className="row">
          <div className="col">
            <label
              className="mt-3 mb-3 col-primary cursor-pointer float-right"
              onClick={() => setUploadMode(uploadModes.FETCH_BY_URL)}
            >
              Fetch by URL
            </label>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Structure of the form to upload a vocabulary using an external URL
   */
  const URLUploadForm = () => {
    return (
      <div className="form-group">
        <label htmlFor="vocabulary-url-input">Vocabulary URL</label>
        <div className="row">
          <div className="col-10">
            <input
              type="url"
              className="form-control"
              id="vocabulary-url-input"
              name="vocabulary-url-input"
              value={vocabularyURL}
              onChange={(e) => setVocabularyURL(e.target.value)}
              onBlur={handleVocabularyURLBlur}
              required={true}
            />
          </div>
          <div className="col-2">
            <a
              className="btn btn-outline-secondary"
              onClick={handleFetchVocabulary}
              disabled={!vocabularyURL}
            >
              Fetch
            </a>
          </div>
        </div>
        <small className="form-text text-muted">It must be a valid URL</small>
        <div className="row">
          <div className="col">
            <label
              className="mt-3 mb-3 col-primary cursor-pointer float-right"
              onClick={() => setUploadMode(uploadModes.FILE_UPLOAD)}
            >
              Upload a file from your system
            </label>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Returns a card with basic information about the recognized vocabulary
   */
  const FetchedVocabularyPreview = () => {
    return (
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-6">{fetchedVocabularyName}</div>
                <div className="col-6">
                  {handleFetchedVocabularyCantConcepts() + " concepts found"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render
   */
  return (
    <Fragment>
      {errors.length ? <AlertNotice message={errors} /> : ""}
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-10">
              <h4>Uploading Vocabulary</h4>
            </div>
            <div className="col-2">
              <a
                className="float-right cursor-pointer"
                onClick={props.onRequestClose}
              >
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Name
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter a name for this vocabulary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            {uploadMode == uploadModes.FILE_UPLOAD ? (
              <FileUploadForm />
            ) : (
              <URLUploadForm />
            )}

            {uploadMode == uploadModes.FILE_UPLOAD && <FileData />}

            {uploadMode == uploadModes.FETCH_BY_URL &&
              !_.isEmpty(fetchedVocabulary) && <FetchedVocabularyPreview />}

            <div className="row">
              <div className="col">
                <button
                  className="btn btn-dark float-right mt-3"
                  type="submit"
                  disabled={!fileContent && _.isEmpty(fetchedVocabulary)}
                >
                  Upload
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UploadVocabulary;
