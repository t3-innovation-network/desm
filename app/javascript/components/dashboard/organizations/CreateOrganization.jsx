import React, { Component } from "react";
import axios from "axios";
import DashboardContainer from "../DashboardContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class CreateOrganization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      createErrors: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleSubmit(event) {
    const { name } = this.state;

    axios
      .post(
        "http://localhost:3000/api/v1/organizations",
        {
          organization: {
            name: name,
          },
        },
        /// Tells the API that's ok to get the cookie in our client
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Organization " + name + " was successfully updated");
          this.props.history.push("/dashboard/organizations");
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
                <i className="fa fa-building"></i>
                <strong>Create Organization</strong>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>
                      Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter a name for this organization"
                      value={this.state.name}
                      onChange={this.handleOnChange}
                      autoFocus
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
