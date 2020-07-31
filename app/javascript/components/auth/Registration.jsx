import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
            email: email
          }
        },
        /// Tells the API that's ok to get the cookie in our client
        { withCredentials: true }
      )
      .then((response) => {
        toast.error("We had an error");
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
        <div className="col-lg-6 mx-auto">
          <div className="card mt-5">
            <div className="card-header">
              <i className="fa fa-users"></i>
              <strong>
                Create User
              </strong>
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
      </React.Fragment>
    );
  }
}

export default Registration;
