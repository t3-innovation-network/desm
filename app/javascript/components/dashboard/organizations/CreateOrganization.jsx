import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createOrganization from "../../../services/createOrganization";

export default class CreateOrganization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      errors: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleSubmit(event) {
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

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <React.Fragment>
        <DashboardContainer>
          <div className="col-lg-6 mx-auto">
            {this.state.errors && <ErrorNotice message={this.state.errors} /> }

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
          <ToastContainer />
        </DashboardContainer>
      </React.Fragment>
    );
  }
}
