import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchOrganizations from "../../api/fetchOrganizations";
import ErrorNotice from "../../shared/ErrorNotice";
import ErrorMessage from "../../helpers/errorMessage";

export default class OrganizationsIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      organizations: [],
      errors: "",
    };
  }

  fetchOrganizationsAPI() {
    fetchOrganizations()
      .then((orgs) => {
        this.setState({
          organizations: orgs,
        });
      })
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error)
        });
      });
  }

  componentDidMount() {
    this.fetchOrganizationsAPI();
  }

  render() {
    return (
      <DashboardContainer
        loggedIn={this.props.loggedIn}
        handleLogout={this.props.handleLogout}
      >
        <div className="col-lg-6 mx-auto">
          {this.state.errors && <ErrorNotice message={this.state.errors} />}

          <div className="card mt-5">
            <div className="card-header">
              <i className="fa fa-building"></i>
              <span className="pl-2 subtitle">Organizations</span>
              <Link
                to="/dashboard/organizations/new"
                className="float-right btn btn-dark btn-sm"
              >
                <i className="fa fa-fw fa-plus-circle"></i>
                <span className="pl-2">Add Organization</span>
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.organizations.map(function (organization) {
                      return (
                        <tr key={organization.id}>
                          <td>{organization.name}</td>
                          <td>
                            <Link
                              to={"/dashboard/organizations/" + organization.id}
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
        <ToastContainer />
      </DashboardContainer>
    );
  }
}