import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class EditOrganization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      organizationErrors: "",
      organization_id: this.props.match.params.id,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  fetchOrganization() {
    axios
      .get("http://localhost:3000/api/v1/organizations/" + this.state.organization_id, {
        withCredentials: true,
      })
      .then((response) => {
        /// We have a list of organizations from the backend
        if (response.data.success) {
          this.setState({
            name: response.data.organization.name
          });
          /// Something happened
        } else {
          this.setState({
            organizationErrors:
              "Couldn't retrieve organization with id " + this.state.organization_id + "!",
          });
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          organizationErrors:
            "Couldn't retrieve organization with id " + this.state.organization_id + "!",
        });
      });
  }

  deleteOrganization() {
    axios
      .delete("http://localhost:3000/api/v1/organizations/" + this.state.organization_id, {
        withCredentials: true,
      })
      .then((response) => {
        /// We have a list of organizations from the backend
        if (response.data.status == "removed") {
          toast.info("Organization successfully removed");
          this.props.history.push("/dashboard/organizations");
        } else {
          /// Something happened
          this.setState({
            organizationErrors:
              "Couldn't remove organization with id " + this.state.organization_id + "!",
          });
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          organizationErrors:
            "Couldn't remove organization with id " + this.state.organization_id + "!",
        });
      });
  }

  componentDidMount() {
    this.fetchOrganization();
  }

  handleSubmit(event) {
    const { name } = this.state;

    axios
      .put(
        "http://localhost:3000/api/v1/organizations/" + this.state.organization_id,
        {
          organization: {
            name: name
          },
        },
        /// Tells the API that's ok to get the cookie in our client
        { withCredentials: true }
      )
      .then((response) => {
        toast.success(
          "Organization " +
            name +
            " (" +
            this.state.organization_id +
            ") was successfully updated"
        );
        this.props.history.push("/dashboard/organizations");
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
              <i className="fa fa-organization"></i>
              <span className="pl-2 subtitle">Organization {this.state.name}</span>
              <button
                className="btn btn-dark float-right"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Delete this organization"
                onClick={() => {
                  this.deleteOrganization();
                }}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
            <div className="card-body">
              {this.state.organizationErrors ? (
                <span className="text-danger">{this.state.organizationErrors}</span>
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
                        Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Enter the name for the organization"
                        value={this.state.name}
                        onChange={(e) => this.handleOnChange(e)}
                        autoFocus
                        required
                      />
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
