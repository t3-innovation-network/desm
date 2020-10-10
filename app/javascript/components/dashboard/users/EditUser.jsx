import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import fetchOrganizations from "../../../services/fetchOrganizations";
import fetchRoles from "../../../services/fetchRoles";
import AlertNotice from "../../shared/AlertNotice";
import ErrorMessage from "../../shared/ErrorMessage";
import fetchUser from "../../../services/fetchUser";
import deleteUser from "../../../services/deleteUser";
import updateUser from "../../../services/updateUser";
import { toastr as toast } from "react-redux-toastr";

export default class EditUser extends Component {
  /**
   * Represents the state of this component. It contains all the fields that are
   * going to be sent to the API service in order to update a user data
   */
  state = {
    fullname: "",
    email: "",
    organization_id: "",
    role_id: "",
    user_id: this.props.match.params.id,
    organizations: [],
    roles: [],
    errors: "",
  };

  /**
   * Update the component state on every change in the input control in the form
   */
  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Use the API service to get this user data
   */
  fetchUserAPI() {
    fetchUser(this.state.user_id).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }

      /// We have a user from the backend
      this.setState({
        fullname: response.user.fullname,
        email: response.user.email,
        organization_id: response.user.organization_id,
        role_id: response.user.role_id,
      });
    });
  }

  /**
   * Use the API service to get the organizations data
   */
  fetchOrganizationsAPI() {
    fetchOrganizations().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
        });
        return;
      }
      this.setState({
        organizations: response.organizations,
      });
    });
  }

  /**
   * Use the API service to get all the roles data
   */
  fetchRolesAPI() {
    fetchRoles().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
        });
        return;
      }
      this.setState({
        roles: response.roles,
      });
    });
  }

  /**
   * Hit the API service to delete this user
   */
  deleteUserAPI() {
    deleteUser(this.state.user_id)
      .then((response) => {
        if (response.error) {
          this.setState({
            errors: response.error,
          });
          return;
        }

        /// We have a list of users from the backend
        toast.info("User successfully removed");
        this.props.history.push("/dashboard/users");
      })
      /// Process any server errors
      .catch((error) => {});
  }

  /**
   * Perform the necessary tasks needed when the component finish mounting
   */
  componentDidMount() {
    this.fetchUserAPI();
    this.fetchOrganizationsAPI();
    this.fetchRolesAPI();
  }

  /**
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  handleSubmit = (event) => {
    const { email, fullname, organization_id, role_id, user_id } = this.state;

    updateUser(user_id, email, fullname, organization_id, role_id)
      .then((response) => {
        if (response.success) {
          toast.success(
            "User " + fullname + " (" + user_id + ") was successfully updated"
          );
          this.props.history.push("/dashboard/users");
        }
      })
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error),
        });
      });

    event.preventDefault();
  };

  render() {
    return (
      <DashboardContainer>
        <div className="col-lg-6 mx-auto mt-5">
          <div className="card mt-5">
            <div className="card-header">
              <i className="fa fa-user"></i>
              <span className="pl-2 subtitle">User {this.state.fullname}</span>
              <button
                className="btn btn-dark float-right"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Delete this user"
                onClick={() => {
                  this.deleteUserAPI();
                }}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
            <div className="card-body">
              {this.state.errors && <AlertNotice message={this.state.errors} />}

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
                      Fullname
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullname"
                      placeholder="Enter the fullname for the user"
                      value={this.state.fullname}
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
                      placeholder="Enter the email for the user"
                      value={this.state.email}
                      onChange={(e) => this.handleOnChange(e)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Organization
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="organization_id"
                      className="form-control"
                      required
                      value={this.state.organization_id}
                      onChange={this.handleOnChange}
                    >
                      {this.state.organizations.map(function (org) {
                        return (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      Role
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="role_id"
                      className="form-control"
                      required
                      value={this.state.role_id}
                      onChange={this.handleOnChange}
                    >
                      {this.state.roles.map(function (role) {
                        return (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        );
                      })}
                    </select>
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
