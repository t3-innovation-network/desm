import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchOrganizations from "../../api/fetchOrganizations";
import fetchRoles from "../../api/fetchRoles";
import ErrorNotice from "../../shared/ErrorNotice";

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

  fetchUser() {
    axios
      .get("http://localhost:3000/users/" + this.state.user_id, {
        withCredentials: true,
      })
      .then((response) => {
        /// We have a list of users from the backend
        if (response.status === 200) {
          this.setState({
            fullname: response.data.fullname,
            email: response.data.email,
            organization_id: response.data.organization_id,
            role_id: response.data.assignments[0].role_id
          });
          /// Something happened
        } else {
          this.setState({
            errors: "Couldn't retrieve user with id " + this.state.user_id + "!",
          });
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          errors: "Couldn't retrieve user with id " + this.state.user_id + "!",
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
        errors: "We had an error: " + error.response.data.error,
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
        registrationErrors: error,
      });
    });
  }

  deleteUser() {
    axios
      .delete("http://localhost:3000/users/" + this.state.user_id, {
        withCredentials: true,
      })
      .then((response) => {
        /// We have a list of users from the backend
        if (response.data.status == "removed") {
          toast.info("User successfully removed");
          this.props.history.push("/dashboard/users");
        } else {
          /// Something happened
          this.setState({
            errors:
              "Couldn't remove user with id " + this.state.user_id + "!",
          });
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          errors:
            "Couldn't remove user with id " + this.state.user_id + "!",
        });
      });
  }

  componentDidMount() {
    this.fetchUser();
    this.fetchOrganizationsAPI();
    this.fetchRolesAPI();
  }

  handleSubmit(event) {
    const { email, fullname, organization_id, role_id } = this.state;

    axios
      .put(
        "http://localhost:3000/users/" + this.state.user_id,
        {
          user: {
            fullname: fullname,
            email: email,
            organization_id: organization_id,
          },
          role_id: role_id
        },
        /// Tells the API that's ok to get the cookie in our client
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success(
            "User " +
              fullname +
              " (" +
              this.state.user_id +
              ") was successfully updated"
          );
          this.props.history.push("/dashboard/users");
        }
      })
      .catch((error) => {
        this.setState({
          errors: "We had an error: " + error.response.data.error,
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
                  this.deleteUser();
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
