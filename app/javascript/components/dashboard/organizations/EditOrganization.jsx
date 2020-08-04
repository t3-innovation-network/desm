import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchOrganization from "../../api/fetchOrganization";
import ErrorMessage from "../../helpers/errorMessage";
import deleteOrganization from "../../api/deleteOrganization";
import updateOrganization from "../../api/updateOrganization";

export default class EditOrganization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      errors: "",
      organization_id: this.props.match.params.id,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  fetchOrganizationAPI() {
    fetchOrganization(this.state.organization_id)
      .then((response) => {
        /// We have a list of organizations from the backend
        if (response.success) {
          this.setState({
            name: response.organization.name
          });
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error)
        });
      });
  }

  deleteOrganizationAPI() {
    deleteOrganization(this.state.organization_id)
      .then((response) => {
        /// We have a list of organizations from the backend
        if (response.success) {
          toast.info("Organization successfully removed");
          this.props.history.push("/dashboard/organizations");
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error)
        });
      });
  }

  componentDidMount() {
    this.fetchOrganizationAPI();
  }

  handleSubmit(event) {
    const { name } = this.state;

    updateOrganization(this.state.organization_id, name)
      .then((response) => {
        if (response.success) {
          toast.success(
            "Organization " + name + " (" + this.state.organization_id + ") was successfully updated"
          );
          this.props.history.push("/dashboard/organizations");
        }
      })
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error)
        });
      });

    event.preventDefault();
  }

  render() {
    return (
      <DashboardContainer
        loggedIn={this.props.loggedIn}
        handleLogout={this.props.handleLogout}
      >
        <div className="col-lg-6 mx-auto">
          {this.state.errors && <ErrorNotice message={this.state.errors} /> }

          <div className="card mt-5">
            <div className="card-header">
              <i className="fa fa-building"></i>
              <span className="pl-2 subtitle">Organization {this.state.name}</span>
              <button
                className="btn btn-dark float-right"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Delete this organization"
                onClick={() => {
                  this.deleteOrganizationAPI();
                }}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
            <div className="card-body">
              {this.state.errors ? (
                <span className="text-danger">{this.state.errors}</span>
              ) : (
                <React.Fragment>
                  <div className="mandatory-fields-notice">
                    <small className="form-text text-muted">
                      Fields with <span className="text-danger">*</span> are
                      mandatory!
                    </small>
                  </div>

                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label>
                        Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Enter the name for the organization"
                        value={this.state.name}
                        onChange={(e) => this.handleOnChange(e)}
                        autoFocus
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-dark">
                      Send
                    </button>
                  </form>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </DashboardContainer>
    );
  }
}