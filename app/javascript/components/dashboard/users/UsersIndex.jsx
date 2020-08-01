import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Helper from "../../api/Helper";

export default class UsersIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      indexErrors: "",
    };
  }

  componentDidMount() {
    Helper.fetchUsers()
      .then((us) => {
        this.setState({
          users: us,
        });
      })
      .catch((error) => {
        this.setState({
          indexErrors: error,
        });
      });
  }

  render() {
    return (
      <DashboardContainer
        loggedIn={this.props.loggedIn}
        handleLogout={this.props.handleLogout}
      >
        <div className="col-lg-6 mx-auto">
          {this.state.indexErrors && (
            <div className="alert alert-danger mt-5">
              <strong>Error!</strong> {this.state.indexErrors}
            </div>
          )}
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
        <ToastContainer />
      </DashboardContainer>
    );
  }
}
