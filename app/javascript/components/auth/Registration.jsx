import React, { Component } from "react";
import DashboardContainer from "../dashboard/DashboardContainer";
import fetchOrganizations from "../../services/fetchOrganizations";
import fetchRoles from "../../services/fetchRoles";
import ErrorNotice from "../shared/ErrorNotice";
import ErrorMessage from "../shared/ErrorMessage";
import createUser from "../../services/createUser";

class Registration extends Component {
  /**
   * Represents the state of this component. It contains all the fields that are
   * going to be sent to the API service to create a user
   */
  state = {
    email: "",
    fullname: "",
    organization_id: "",
    role_id: "",
    organizations: [],
    roles: [],
    errors: "",
  };

  /**
   * Use the API service to get all the organizations data
   */
  fetchOrganizationsAPI() {
    fetchOrganizations()
      .then((orgs) => {
        this.setState({
          organizations: orgs,
          organization_id: orgs[0].id,
        });
      })
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error),
        });
      });
  }

  /**
   * Use the API service to get all the roles data
   */
  fetchRolesAPI() {
    fetchRoles()
      .then((Allroles) => {
        this.setState({
          roles: Allroles,
          role_id: Allroles[0].id,
        });
      })
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error),
        });
      });
  }

  /**
   * Prepare the data in the form to be sent to the API service, then call the
   * service with that data and expect the result to show to the user
   */
  handleSubmit = (event) => {
    const { email, fullname, organization_id, role_id } = this.state;

    createUser(fullname, email, organization_id, role_id)
      .then((response) => {
        if (response.success) {
          toast.success("User " + fullname + " was successfully created");
          this.props.history.push("/dashboard/users");
        }
      })
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error),
        });
      });

    event.preventDefault();
  }

  /**
   * Update the component state on every change in the input control in the form
   */
  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  /**
   * Perform the necessary tasks needed when the component finish mounting
   */
  componentDidMount() {
    this.fetchOrganizationsAPI();
    this.fetchRolesAPI();
  }

  render() {
    return (
      <React.Fragment>
        <DashboardContainer>
          <div className="col-lg-6 mx-auto">
            {this.state.errors && <ErrorNotice message={this.state.errors} />}

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

export default Registration;
