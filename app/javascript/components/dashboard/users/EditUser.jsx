import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchOrganizations from "../../../services/fetchOrganizations";
import fetchRoles from "../../../services/fetchRoles";
import ErrorNotice from "../../shared/ErrorNotice";
import ErrorMessage from "../../shared/ErrorMessage";
import fetchUser from "../../../services/fetchUser";
import deleteUser from "../../../services/deleteUser";
import updateUser from "../../../services/updateUser";

export default class EditUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: "",
      email: "",
      organization_id: "",
      role_id: "",
      user_id: this.props.match.params.id,
      organizations: [],
      roles: [],
      errors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  fetchUserAPI() {
    fetchUser(this.state.user_id)
      .then((response) => {
        /// We have a user from the backend
        if (response.user !== undefined) {
          this.setState({
            fullname: response.user.fullname,
            email: response.user.email,
            organization_id: response.user.organization_id,
            role_id: response.user.role_id
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

  fetchOrganizationsAPI() {
    fetchOrganizations().then((orgs) => {
      this.setState({
        organizations: orgs,
      });
    })
    .catch(error => {
      this.setState({
        errors: ErrorMessage(error)
      });
    });
  }

  fetchRolesAPI() {
    fetchRoles().then((Allroles) => {
      this.setState({
        roles: Allroles,
      });
    })
    .catch(error => {
      this.setState({
        errors: ErrorMessage(error)
      });
    });
  }

  deleteUserAPI() {
    deleteUser(this.state.user_id)
      .then((response) => {
        /// We have a list of users from the backend
        if (response.removed) {
          toast.info("User successfully removed");
          this.props.history.push("/dashboard/users");
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
    this.fetchUserAPI();
    this.fetchOrganizationsAPI();
    this.fetchRolesAPI();
  }

  handleSubmit(event) {
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
              {this.state.errors && <ErrorNotice message={this.state.errors} /> }

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
                      onChange={(e) => this.handleOnChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Organization
                      <span className="text-danger">*</span></label>
                      <select
                        name="organization_id"
                        className="form-control"
                        required
                        value={this.state.organization_id}
                        onChange={this.handleOnChange}
                      >
                        {
                          this.state.organizations.map(function (org) {
                            return (
                              <option key={org.id} value={org.id}>{org.name}</option>
                            );
                          })
                        }
                      </select>
                    </div>

                    <div className="form-group">
                      <label>
                        Role
                        <span className="text-danger">*</span></label>
                        <select
                          name="role_id"
                          className="form-control"
                          required
                          value={this.state.role_id}
                          onChange={this.handleOnChange}
                        >
                          {
                            this.state.roles.map(function (role) {
                              return (
                                <option key={role.id} value={role.id}>{role.name}</option>
                              );
                            })
                          }
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
        <ToastContainer />
      </DashboardContainer>
    );
  }
}
