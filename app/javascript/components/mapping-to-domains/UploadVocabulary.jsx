import React, { useEffect, useState } from "react";
import createVocabulary from "../../services/createVocabulary";
import FileInfo from "../mapping/FileInfo";
import { toastr as toast } from "react-redux-toastr";

var isJSON = require("is-valid-json");

const UploadVocabulary = (props) => {
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
      setErrors("File could not be read! Code: " + e.target.error.code);
    };

    reader.readAsText(file);
  };

  /**
   * Manages to corroborate that the file content is a valid JSON
   *
   * @param {String} content
   */
  const validateJSON = (content) => {
    let isValid = isJSON(content);

    if (!isValid) {
      toast.error(
        "Invalid JSON!\nBe sure to validate the file before uploading"
      );
    }

    return isValid;
  };

  /**
   * Send the file with the vocabulary to the backend
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateJSON(fileContent)) {
      props.onVocabularyAdded({
        vocabulary: {
          name: name,
          content: JSON.parse(fileContent),
        },
      });

      props.onRequestClose();
    }
  };

  return (
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
                  required={true}
                />
                <label
                  className="custom-file-label"
                  htmlFor="file-vocab-uploader"
                >
                  Attach File
                  <span className="text-danger">*</span>
                </label>
              </div>
            </div>
            <small className="mt-5">
              You can upload your concept scheme file in JSONLD format (skos file)
            </small>
          </div>

          <FileData />

          <button
            className="btn btn-dark float-right mt-3"
            type="submit"
            disabled={!file}
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVocabulary;
