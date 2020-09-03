import React, { useState, useEffect } from "react";
import validator from "validator";
import ErrorNotice from "../shared/ErrorNotice";
import FileInfo from "./FileInfo";
import { useSelector, useDispatch } from "react-redux";
import { setFiles } from "../../actions/files";
import { doSubmit } from "../../actions/mappingform";
import fetchDomains from "../../services/fetchDomains";
import {toastr as toast} from 'react-redux-toastr';

const MappingForm = (props) => {

  const [errors, setErrors] = useState("");
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [use_case, setUseCase] = useState("");
  const [domains, setDomains] = useState([]);
  const [domainID, setDomainId] = useState(null);
  const files = useSelector((state) => state.files);
  const submitted = useSelector((state) => state.submitted);
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
    dispatch(doSubmit());
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

  /**
   * Fecth the domains to be listed in the new mapping form
   * then put it in the local sate
   */
  const fillWithDomains = () => {
    let domains = fetchDomains().then((response) => {
      setDomains(response);
      setDomainId(response[0].id);
    })
  }

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fillWithDomains'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    fillWithDomains();
  }, []);

  return (
    <React.Fragment>
      <div className={(submitted ? "disabled-form ": " ") + "col-lg-6 p-lg-5 pt-5"}>
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
                onChange={e => setVersion(e.target.value)}
                required
                disabled={submitted}
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
                disabled={submitted}
              />
              <small className="form-text text-muted">
                It must be a valid URL
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="domains_to_map">
                Which domain are you uploading?
              </label>
              <div className="col-sm-10">

              {domains.map(function (dom) {
                return (
                  <div className="form-check" key={dom.id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      id={dom.id}
                      name="domain_id"
                      value={dom.id}
                      onChange={e => setDomainId(e.target.value)}
                    />
                    <label
                      htmlFor={dom.id}
                      className="form-check-label cursor-pointer"
                    >
                      {dom.name}
                    </label>
                  </div>
                );
              })}

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
                    disabled={submitted}
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
              <label className="mt-3">
                You can upload your specification as RDF, JSON, XML or JSONLD format
              </label>
            </div>

            <section>
              <button type="submit" className="btn btn-dark mt-3">
                Import Specification
              </button>
            </section>

            {fileData()}
          </form>
        </section>
      </div>
    </React.Fragment>
  );
}

export default MappingForm;
