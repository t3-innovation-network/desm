import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import createOrganization from "../../../services/createOrganization";
import {toastr as toast} from 'react-redux-toastr';

export default class CreateOrganization extends Component {
  /**
   * Represents the state of this component. It contains all the fields that are
   * going to be sent to the API service in order to create an organization
   */
  state = {
    name: "",
    errors: "",
  };

  /**
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  handleSubmit = (event) => {
    const { name } = this.state;

    createOrganization(name)
      .then((response) => {
        if (response.success) {
          toast.success("Organization " + name + " was successfully created");
          this.props.history.push("/dashboard/organizations");
        }
      })
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error)
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

  render() {
    return (
      <React.Fragment>
        <DashboardContainer>
          <div className="col-lg-6 mx-auto">
            {this.state.errors && <AlertNotice message={this.state.errors} /> }

            <div className="card mt-5">
              <div className="card-header">
                <i className="fa fa-building"></i>
                <span className="pl-2 subtitle">Create Organization</span>
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
        </DashboardContainer>
      </React.Fragment>
    );
  }
}
