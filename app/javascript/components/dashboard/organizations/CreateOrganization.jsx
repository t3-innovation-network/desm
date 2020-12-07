import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import createOrganization from "../../../services/createOrganization";
import { toastr as toast } from "react-redux-toastr";
import AlertNotice from "../../shared/AlertNotice";

export default class CreateOrganization extends Component {
  /**
   * Represents the state of this component. It contains all the fields that are
   * going to be sent to the API service in order to create an organization
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
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  handleSubmit = async (event) => {
    const { organization } = this.state;

    event.preventDefault();

    let response = await createOrganization(organization);

    if (response.error) {
      this.setState({
        errors: response.error,
      });
      return;
    }

    if (response.success) {
      toast.success("Organization " + organization.name + " was successfully created");
      this.props.history.push("/dashboard/organizations");
      return;
    }
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

  render() {
    /**
     * Elements from state
     */
    const { errors, organization } = this.state;

    return (
      <React.Fragment>
        <DashboardContainer>
          <div className="col-lg-6 mx-auto mt-5">
            {errors && <AlertNotice message={errors} />}

            <div className="card mt-5">
              <div className="card-header">
                <i className="fa fa-building"></i>
                <span className="pl-2 subtitle">Create Organization</span>
              </div>
              <div className="card-body">
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
                      placeholder="Enter a name for this organization"
                      value={organization.name}
                      onChange={this.handleOnChange}
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
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        </DashboardContainer>
      </React.Fragment>
    );
  }
}
