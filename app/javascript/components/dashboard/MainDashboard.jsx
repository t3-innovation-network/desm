import React, { Component } from "react";
import DashboardContainer from "./DashboardContainer";
import fetchOrganizations from "../../services/fetchOrganizations";
import AlertNotice from "../shared/AlertNotice";
import ErrorMessage from "../shared/ErrorMessage";
import OrganizationInfo from "./organizations/OrganizationInfo";

export default class MainDashboard extends Component {
  state = {
    organizations: [],
    errors: "",
  };

  /**
   * Get the organizations data to be able to show it in the UI
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
   * Tasks to execute after the first mount of this component
   */
  componentDidMount() {
    this.fetchOrganizationsAPI();
  }

  render() {
    return (
      <DashboardContainer>
        <div className="col col-md-10 mt-5">
          <div className="row h-50 ml-5">
            {this.state.errors && <AlertNotice message={this.state.errors} />}

            {this.state.organizations.map((o) => {
              return <OrganizationInfo organization={o} key={o.id} />;
            })}
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
