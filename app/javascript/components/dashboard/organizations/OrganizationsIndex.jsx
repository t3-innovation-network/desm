import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { Link } from "react-router-dom";
import fetchOrganizations from "../../../services/fetchOrganizations";
import AlertNotice from "../../shared/AlertNotice";

export default class OrganizationsIndex extends Component {
  /**
   * Represents the state of this component. It contains the list of data
   * that's going to be shown to the user
   */
  state = {
    organizations: [],
    errors: "",
  };

  /**
   * Use the API service to get the organizations data
   */
  fetchOrganizationsAPI() {
    fetchOrganizations().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
        });
        return;
      }
      this.setState({
        organizations: response.organizations,
      });
    });
  }

  /**
   * Perform the necessary tasks needed when the component finish mounting
   */
  componentDidMount() {
    this.fetchOrganizationsAPI();
  }

  render() {
    return (
      <DashboardContainer>
        {this.state.errors && <AlertNotice message={this.state.errors} />}

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
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.organizations.map(function (organization) {
                    return (
                      <tr key={organization.id}>
                        <td>{organization.name}</td>
                        <td>{organization.email}</td>
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
      </DashboardContainer>
    );
  }
}
