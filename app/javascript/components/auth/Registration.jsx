import React, { Component } from "react";
import axios from "axios";
import DashboardContainer from "../dashboard/DashboardContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchOrganizations from "../api/fetchOrganizations";
import fetchRoles from "../api/fetchRoles";
import ErrorNotice from "../shared/ErrorNotice";

class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      fullname: "",
      organization_id: "",
      role_id: "",
      organizations: [],
      roles: [],
      errors: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  fetchOrganizationsAPI() {
    fetchOrganizations().then((orgs) => {
      this.setState({
        organizations: orgs,
        organization_id: orgs[0].id
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
        role_id: Allroles[0].id
      });
    })
    .catch(error => {
      this.setState({
        errors: "We had an error: " + error.response.data.error,
      });
    });
  }

  handleSubmit(event) {
    const { email, fullname, organization_id, role_id } = this.state;

    axios
      .post(
        "http://localhost:3000/registrations",
        {
          user: {
            fullname: fullname,
            email: email,
            organization_id: organization_id
          },
          role_id: role_id
        },
        /// Tells the API that's ok to get the cookie in our client
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success("User " + fullname + " was successfully created");
          this.props.history.push("/dashboard/users");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });

    event.preventDefault();
  }

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  componentDidMount() {
    this.fetchOrganizationsAPI();
    this.fetchRolesAPI();
  }

  render() {
    return (
      <React.Fragment>
        <DashboardContainer
          loggedIn={this.props.loggedIn}
          handleLogout={this.props.handleLogout}
        >
          <div className="col-lg-6 mx-auto">
            {this.state.errors && <ErrorNotice message={this.state.errors} /> }

            <div className="card mt-5">
              <div className="card-header">
                <i className="fa fa-users"></i>
                <span className="pl-2 subtitle">Create User</span>
              </div>
              <div className="card-body">
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
                      placeholder="Enter the email for the user"
                      value={this.state.email}
                      onChange={this.handleOnChange}
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
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
          <ToastContainer />
        </DashboardContainer>
      </React.Fragment>
    );
  }
}

export default Registration;
