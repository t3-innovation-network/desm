import React from "react";
import validator from "validator";
import ErrorNotice from "../shared/ErrorNotice";
import { toast } from "react-toastify";

class LeftSideForm extends React.Component {
  constructor() {
    super();

    this.state = {
      errors: "",
      name: "",
      version: "",
      use_case: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleUseCaseBlur = this.handleUseCaseBlur.bind(this);
  }

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleUseCaseBlur() {
    if (!validator.isURL(this.state.use_case)) {
      this.setState({
        errors: "'Use case' must be a valid URL",
      });
    } else {
      this.setState({
        errors: "",
      });
    }
  }

  handleSubmit(event) {
    if (this.state.errors) {
      toast.error("Please correct the errors first");
      event.preventDefault();
      return;
    }

    event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-lg-6 p-lg-5 pt-5">
          {this.state.errors && <ErrorNotice message={this.state.errors} />}

          <div className="mandatory-fields-notice">
            <small className="form-text text-muted">
              Fields with <span className="text-danger">*</span> are mandatory!
            </small>
          </div>

          <section>
            <h6 className="subtitle">1. Upload Your Specification</h6>

            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="specification_name">
                  Name of your specification
                </label>
                <input
                  type="text"
                  name="name"
                  id="specification_name"
                  className="form-control"
                  value={this.state.name}
                  onChange={this.handleOnChange}
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
                  value={this.state.version}
                  onChange={this.handleOnChange}
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
                  value={this.state.use_case}
                  onBlur={this.handleUseCaseBlur}
                  onChange={this.handleOnChange}
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
                      className="custom-file-input"
                      id="file-uploader"
                      aria-describedby="upload-help"
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
}

export default LeftSideForm;
