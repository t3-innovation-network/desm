import React, { useEffect, useState } from "react";
import createVocabulary from "../../services/createVocabulary";
import FileInfo from "../mapping/FileInfo";
import { toastr as toast } from "react-redux-toastr";

var isJSON = require('is-valid-json');

const UploadVocabulary = (props) => {
  /**
   * The uploaded file whixh will contain the specification of
   * a vocabulary in a concept scheme json-ld format
   */
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
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
  const fileData = () => {
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
      toast.error("Invalid JSON!\nBe sure to validate the file before uploading");
    }

    return isValid;
  }

  /**
   * Send the file with the vocabulary to the backend
   */
  const handleCreateVocabulary = (event) => {
    if(validateJSON(fileContent)) {
      let data = {
        name: name,
        content: fileContent,
      };

      createVocabulary(data).then((response) => {
        props.onVocabularyAdded({
          id: response.vocabulary.id,
          name: response.vocabulary.name,
        });
        props.onRequestClose();
      }).catch(e => {
        console.log(e);
        toast.error("Error! " + e.response.data.message);
      });
    }
    event.preventDefault();
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
        <form onSubmit={handleCreateVocabulary}>
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
                  id="file-uploader"
                  aria-describedby="upload-help"
                  // accept=".rdf, .json, .jsonld, .xml"
                  accept=".json, .jsonld"
                  onChange={handleFileChange}
                  required={true}
                />
                <label className="custom-file-label" htmlFor="file-uploader">
                  Attach File
                  <span className="text-danger">*</span>
                </label>
              </div>
            </div>
            <small className="mt-5">
              You can upload your concept scheme file as RDF, JSON, XML or JSONLD
              format
            </small>
          </div>

          {fileData()}

          {file != null && (
            <button
              className="btn btn-dark float-right mt-3"
              type="submit"
            >
              Upload
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadVocabulary;
