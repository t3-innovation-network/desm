import React, { useState } from "react";
import validator from "validator";
import ErrorNotice from "../shared/ErrorNotice";
import { toast } from "react-toastify";
import FileInfo from "./FileInfo";
import { useSelector, useDispatch } from "react-redux";
import { setFiles } from "../../actions/files";

const MappingForm = (props) => {

  const [errors, setErrors] = useState("");
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [use_case, setUseCase] = useState("");

  const files = useSelector((state) => state.files);
  const dispatch = useDispatch();

  /**
   * Update the files in the redux store (main application state) when
   * the input changes (after the user selects file/s)
   */
  const handleFileChange = (event) => {
    dispatch(setFiles(Array.from(event.target.files)));
  }

  /**
   * Validates the use case to be a valid URL after the user focuses
   * out the "use case" input
   */
  const handleUseCaseBlur = () => {
    if (!validator.isURL(use_case)) {
      setErrors("'Use case' must be a valid URL");
    } else {
      setErrors("");
    }
  }

  /**
   * Send the file/s to the API service to be parsed
   */
  const handleSubmit = (event) => {
    if (errors) {
      toast.error("Please correct the errors first");
      event.preventDefault();
      return;
    }
    /**
     * @todo Implement sending the files to the API service
     */
    event.preventDefault();
  }

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
        <label>
          {files ? files.length : 0} files
          attached
        </label>
        {fileCards}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className="col-lg-6 p-lg-5 pt-5">
        {errors && <ErrorNotice message={errors} />}

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
                onChange={e => setName(e.target.value)}
                required
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
                onChange={e => setVersion(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="use_case">Use Case</label>
              <input
                type="text"
                className="form-control"
                id="use_case"
                name="use_case"
                value={use_case}
                onBlur={handleUseCaseBlur}
                onChange={e => setUseCase(e.target.value)}
              />
              <small className="form-text text-muted">
                It must be a valid URL
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="domains_to_map">
                Which of the following domains are you mapping to?
              </label>
              <div className="col-lg-4 col-md-4 domain-option">
                <div className="form-check-inline">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      value="1"
                      className="form-check-input"
                    />
                    Person
                  </label>
                </div>
              </div>
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
                    accept=".rdf, .json, .jsonld, .xml"
                    onChange={handleFileChange}
                    required={true}
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="file-uploader"
                  >
                    Attach File
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>
            </div>

            {fileData()}

            <section>
              <button type="submit" className="btn btn-dark mt-3">
                Import Mapping
              </button>
            </section>
          </form>
        </section>
      </div>
    </React.Fragment>
  );
}

export default MappingForm;
