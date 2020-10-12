import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { Link } from "react-router-dom";
import fetchUsers from "../../../services/fetchUsers";
import AlertNotice from "../../shared/AlertNotice";

export default class UsersIndex extends Component {
  /**
   * Represents the state of this component. It contains the list of data
   * that's going to be shown to the user
   */
  state = {
    users: [],
    errors: "",
  };

  /**
   * Use the API service to get this user data
   */
  fetchUsersAPI() {
    fetchUsers().then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      this.setState({
        users: response.users,
      });
    });
  }

  /**
   * Perform the necessary tasks needed when the component finish mounting
   */
  componentDidMount() {
    this.fetchUsersAPI();
  }

  render() {
    return (
      <DashboardContainer>
        <div className="col-lg-6 mx-auto mt-5">
          {this.state.errors && <AlertNotice message={this.state.errors} />}

          <div className="card mt-5">
            <div className="card-header">
              <i className="fa fa-users"></i>
              <span className="pl-2 subtitle">Users</span>
              <Link
                to="/dashboard/users/new"
                className="float-right btn btn-dark btn-sm"
              >
                <i className="fa fa-fw fa-plus-circle"></i>
                <span className="pl-2">Add User</span>
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Fullname</th>
                      <th>Email</th>
                      <th>Organization</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.users.map(function (user) {
                      return (
                        <tr key={user.id}>
                          <td>{user.fullname}</td>
                          <td>{user.email}</td>
                          <td>{user.organization.name}</td>
                          <td>
                            <Link
                              to={"/dashboard/users/" + user.id}
                              className="btn btn-dark"
                            >
                              <i
                                className="fa fa-pencil-alt"
                                aria-hidden="true"
                              ></i>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
