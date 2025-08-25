import { useState } from 'react';
import { isEmpty, isString } from 'lodash';
import FileInfo from '../mapping/FileInfo';
import AlertNotice from '../shared/AlertNotice';
import fetchExternalVocabulary from './../../services/fetchExternalVocabulary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const UploadVocabulary = (props) => {
  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);
  /**
   * Represents the available types of fetching a vocabulary
   */
  const uploadModes = {
    FILE_UPLOAD: 'file-upload',
    FETCH_BY_URL: 'fetch-by-url',
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
   * Name for the vocabulary
   */
  const [name, setName] = useState('');
  /**
   * URL to fetch the vocabulary from
   */
  const [vocabularyURL, setVocabularyURL] = useState('');
  /**
   * The vocabulary that's fetched using an external URL
   */
  const [fetchedVocabulary, setFetchedVocabulary] = useState({});
  const [fetching, setFetching] = useState(false);

  /**
   * Update the files in the redux store (main application state) when
   * the input changes (after the user selects file/s)
   */
  const handleFileChange = (event) => {
    setErrors([]);
    setFile(event.target.files[0]);
    setVocabularyURL(null);
  };

  /**
   * File content to be displayed after
   * file upload is complete
   *
   * @returns {React.}
   */
  const FileData = () => {
    return file != null ? (
      <FileInfo selectedFile={file} key={Date.now() + file.lastModified} />
    ) : (
      ''
    );
  };

  /**
   * Fetch the vocabulary from the provided URL
   */
  const handleFetchVocabulary = async () => {
    document.body.classList.add('waiting');
    setFetching(true);

    const { error, vocabulary } = await fetchExternalVocabulary(vocabularyURL);

    if (error) {
      setErrors([error]);
    } else {
      setFetchedVocabulary(vocabulary);
    }

    document.body.classList.remove('waiting');
    setFetching(false);
  };

  const handleVocabularyURLChange = (e) => {
    setErrors([]);
    setVocabularyURL(e.target.value);
    setFile(null);
  };

  /**
   * Generates the content for the vocabulary to be submitted
   * Case 1: The vocabulary was submitted using a file from the filesystem
   * Case 2: The vocabulary was uploaded by using a service by HTTP (an external URL)
   */
  const vocabularyToSubmit = () => {
    switch (uploadMode) {
      case uploadModes.FETCH_BY_URL:
        return isString(fetchedVocabulary) ? fetchedVocabulary : JSON.stringify(fetchedVocabulary);
      case uploadModes.FILE_UPLOAD:
        return null;
    }
  };

  /**
   * Send the file with the vocabulary to the backend
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);

    if (uploadMode === uploadModes.FILE_UPLOAD && file) {
      formData.append('file', file);
    } else if (uploadMode === uploadModes.FETCH_BY_URL) {
      formData.append('url', vocabularyURL);
      formData.append('content', vocabularyToSubmit());
    }

    const response = await props.onVocabularyAdded(formData);

    if (response.error) {
      setErrors([response.error]);
    } else {
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
          <span className="input-group-text" id="upload-help">
            Upload
          </span>
          <div className="custom-file">
            <input
              type="file"
              className="file"
              data-show-upload="true"
              data-show-caption="true"
              id="file-vocab-uploader"
              aria-describedby="upload-help"
              accept=".csv, .json, .jsonld, .nt, .rdf, .ttl, .xml, .xsd, .zip"
              onChange={handleFileChange}
            />
            <label className="custom-file-label" htmlFor="file-vocab-uploader">
              Attach File
              <span className="text-danger">*</span>
            </label>
          </div>
        </div>
        <small className="mt-5">
          You can upload your concept scheme file in RDF - SKOS (Turtle, JSON-LD or RDF/XML
          serializations), JSON-Schema and XML Schema (XSD) enumerations, and CSV.
        </small>
        <div className="row">
          <div className="col">
            <label
              className="mt-3 mb-3 col-primary cursor-pointer float-end"
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
        <label className="form-label" htmlFor="vocabulary-url-input">
          Vocabulary URL
        </label>
        <div className="row">
          <div className="col-10">
            <input
              type="url"
              className="form-control"
              id="vocabulary-url-input"
              name="vocabulary-url-input"
              value={vocabularyURL}
              onChange={handleVocabularyURLChange}
              required={true}
            />
          </div>
          <div className="col-2">
            <a
              className="btn btn-outline-secondary"
              onClick={handleFetchVocabulary}
              disabled={fetching || !vocabularyURL}
            >
              Fetch
            </a>
          </div>
        </div>
        <small className="form-text text-body-secondary">It must be a valid URL</small>
        <div className="row">
          <div className="col">
            <label
              className="mt-3 mb-3 col-primary cursor-pointer float-end"
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
  const FetchedVocabularyPreview = () => (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>URL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span className="text-break">{vocabularyURL}</span>
          </td>
        </tr>
      </tbody>
    </table>
  );

  /**
   * Render
   */
  return (
    <>
      {errors.length ? <AlertNotice message={errors} onClose={() => setErrors([])} /> : ''}
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-10">
              <h4>Uploading Controlled Vocabulary</h4>
            </div>
            <div className="col-2">
              <a className="float-end cursor-pointer" onClick={props.onRequestClose}>
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Name
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter a name for this controlled vocabulary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            {uploadMode == uploadModes.FILE_UPLOAD ? <FileUploadForm /> : URLUploadForm()}

            {uploadMode == uploadModes.FILE_UPLOAD && <FileData />}

            {uploadMode == uploadModes.FETCH_BY_URL && !isEmpty(fetchedVocabulary) && (
              <FetchedVocabularyPreview />
            )}

            <div className="row">
              <div className="col">
                <button
                  className="btn btn-dark float-end mt-3"
                  type="submit"
                  disabled={!file && isEmpty(fetchedVocabulary)}
                >
                  Upload
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadVocabulary;
