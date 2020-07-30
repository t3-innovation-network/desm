import React, { Component } from "react";
import axios from "axios";

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      sign_in_errors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleSubmit(event) {
    const { email, password } = this.state;

    axios
      .post(
        "http://localhost:3000/sessions",
        {
          user: {
            email: email,
            password: password
          }
        },
        /// Tells the API that's ok to get the cookie in our client
        { withCredentials: true }
      )
      .then((response) => {
        console.log("sign-in response: ", response.data);
      })
      .catch((error) => {
        console.log("sign-in error: ", error);
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
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>
              Email
              <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={this.state.email}
              onChange={this.handleOnChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Password
              <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter your password"
              value={this.state.password}
              onChange={this.handleOnChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark">
            Sign In
          </button>
        </form>
      </div>
    );
  }
}

export default SignIn;
