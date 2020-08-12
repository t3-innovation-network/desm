import React, { Component } from "react";
import DashboardContainer from "./DashboardContainer";
import fetchOrganizations from "../../services/fetchOrganizations"
import ErrorNotice from "../shared/ErrorNotice";
import ErrorMessage from "../shared/ErrorMessage";
import OrganizationInfo from "./organizations/OrganizationInfo";

export default class MainDashboard extends Component {
  state = {
    organizations: [],
    errors: ""
  }

  /**
   * Get the organizations data to be able to show it in the UI
   */
  fetchOrganizationsAPI() {
    fetchOrganizations()
      .then((orgs) => {
        this.setState({
          organizations: orgs,
        });
      })
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error),
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
          <div className="row h-50">
            {this.state.errors && <ErrorNotice message={this.state.errors} />}

            { this.state.organizations.map((o) => {
              return <OrganizationInfo organization={o} key={o.id} />
            }) }
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
