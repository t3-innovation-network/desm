import React, { Component } from "react";
import axios from "axios";
import DashboardContainer from "../dashboard/DashboardContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      password_confirmation: "",
      fullname: "",
      registrationErros: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleSubmit(event) {
    const { email, fullname } = this.state;

    axios
      .post(
        "http://localhost:3000/registrations",
        {
          user: {
            fullname: fullname,
            email: email,
          },
        },
        /// Tells the API that's ok to get the cookie in our client
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.status === "created") {
          toast.success("User " + fullname + " was successfully updated");
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

  render() {
    return (
      <React.Fragment>
        <DashboardContainer
          loggedIn={this.props.loggedIn}
          handleLogout={this.props.handleLogout}
        >
          <div className="col-lg-6 mx-auto">
            <div className="card mt-5">
              <div className="card-header">
                <i className="fa fa-users"></i>
                <strong>Create User</strong>
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
