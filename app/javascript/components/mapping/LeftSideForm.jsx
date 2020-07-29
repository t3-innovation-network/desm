import React from "react";
import { Link } from "react-router-dom";

class LeftSideForm extends React.Component {
  render() {
    return (
      <div className="col-lg-6 p-lg-5 pt-5">

        <div className="mandatory-fields-notice">
          <small className="form-text text-muted">Fields with <span className="text-danger">*</span> are mandatory!</small>
        </div>

        <section>
          <h6 className="subtitle">1. Upload Your Specification</h6>

          <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="specification_name">Name of your specification</label>
                <input
                  type="text"
                  name="name"
                  id="specification_name"
                  className="form-control"
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
                  required
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="use_case">Use Case</label>
                <input
                  type="text"
                  className="form-control"
                  id="use_case"
                  name="use_case"
                  required
                  onChange={this.onChange}
                />
                <small className="form-text text-muted">
                  It must be a valid URL
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="domains_to_map">Which of the following domains are you mapping to?</label>
                  <div className="col-lg-4 col-md-4 domain-option">
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="checkbox" value="1" className="form-check-input"/>
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
                    <input type="file" className="custom-file-input" id="file-uploader" aria-describedby="upload-help" required={true}/>
                    <label className="custom-file-label" htmlFor="file-uploader">
                      Attach File
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <section>
                <button type="submit" className="btn btn-dark mt-3">
                  Import Mapping
                </button>
              </section>
            </form>
        </section>
      </div>
    );
  }
}
export default LeftSideForm;
