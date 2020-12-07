import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import fetchOrganization from "../../../services/fetchOrganization";
import AlertNotice from "../../shared/AlertNotice";
import deleteOrganization from "../../../services/deleteOrganization";
import updateOrganization from "../../../services/updateOrganization";
import { toastr as toast } from "react-redux-toastr";

export default class EditOrganization extends Component {
  /**
   * Represents the state of this component. It contains all the fields that are
   * going to be sent to the API service in order to update an organization
   */
  state = {
    /**
     * Errors from this component's actions
     */
    errors: "",
    /**
     * The representation of the organization in the state of this component
     */
    organization: {
      name: "",
      email: "",
    },
  };

  /**
   * Update the component state on every change in the input control in the form
   */
  handleOnChange = (event) => {
    const { organization } = this.state;

    let org = organization;
    org[event.target.name] = event.target.value;

    this.setState({
      organization: org,
    });
  };

  /**
   * Use the API service to get this organization data
   */
  handleFetchOrganization() {
    let orgId = this.props.match.params.id;

    fetchOrganization(orgId).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      /// We have the organization data from the API service
      this.setState({
        organization: response.organization,
      });
    });
  }

  /**
   * Hit the API service to delete this organization
   */
  deleteOrganizationAPI() {
    const { organization } = this.state;

    deleteOrganization(organization.id).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      /// We have a list of organizations from the backend
      toast.info("Organization successfully removed");
      this.props.history.push("/dashboard/organizations");
    });
  }

  /**
   * Perform the necessary tasks needed when the component finish mounting
   */
  componentDidMount() {
    this.handleFetchOrganization();
  }

  /**
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  handleSubmit = (event) => {
    const { organization } = this.state;

    updateOrganization(organization.id, {
      email: organization.email,
      name: organization.name,
    }).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      toast.success(
        "Organization " +
          organization.name +
          " (" +
          organization.id +
          ") was successfully updated"
      );
      this.props.history.push("/dashboard/organizations");
    });

    event.preventDefault();
  };

  render() {
    /**
     * Elements from state
     */
    const { errors, organization } = this.state;

    return (
      <DashboardContainer>
        <div className="col-lg-6 mx-auto mt-5">
          {errors && <AlertNotice message={errors} />}

          <div className="card mt-5">
            <div className="card-header">
              <i className="fa fa-building"></i>
              <span className="pl-2 subtitle">
                Organization {organization.name}
              </span>
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
                      value={organization.name}
                      onChange={(e) => this.handleOnChange(e)}
                      autoFocus
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Email
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter an email for the organization"
                      value={organization.email}
                      onChange={(e) => this.handleOnChange(e)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-dark">
                    Send
                  </button>
                </form>
              </React.Fragment>
            </div>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
