import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Helper from "../../api/Helper";

export default class EditUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: "",
      email: "",
      organization_id: null,
      userErrors: "",
      user_id: this.props.match.params.id,
      organizations: []
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
        if (response.data.success) {
          this.setState({
            fullname: response.data.user.fullname,
            email: response.data.user.email,
            organization_id: response.data.user.organization_id
          });
          /// Something happened
        } else {
          this.setState({
            userErrors:
              "Couldn't retrieve user with id " + this.state.user_id + "!",
          });
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          userErrors:
            "Couldn't retrieve user with id " + this.state.user_id + "!",
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
            userErrors:
              "Couldn't remove user with id " + this.state.user_id + "!",
          });
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          userErrors:
            "Couldn't remove user with id " + this.state.user_id + "!",
        });
      });
  }


  componentDidMount() {
    this.fetchUser();

    Helper.fetchOrganizations().then((orgs) => {
      this.setState({
        organizations: orgs,
      });
    })
    .catch(error => {
      toast.error(error);
    });
  }

  handleSubmit(event) {
    const { email, fullname, organization_id } = this.state;

    axios
      .put(
        "http://localhost:3000/users/" + this.state.user_id,
        {
          user: {
            fullname: fullname,
            email: email,
            organization_id: organization_id,
          },
        },
        /// Tells the API that's ok to get the cookie in our client
        { withCredentials: true }
      )
      .then((response) => {
        toast.success(
          "User " +
            fullname +
            " (" +
            this.state.user_id +
            ") was successfully updated"
        );
        this.props.history.push("/dashboard/users");
      })
      .catch((error) => {
        toast.error(error.message);
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
              {this.state.userErrors ? (
                <span className="text-danger">{this.state.userErrors}</span>
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
