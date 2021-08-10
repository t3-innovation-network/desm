import React, { Component } from "react";
import DashboardContainer from "./DashboardContainer";
import fetchOrganizations from "../../services/fetchOrganizations";
import AlertNotice from "../shared/AlertNotice";
import OrganizationInfo from "./organizations/OrganizationInfo";
import { Link } from "react-router-dom";

export default class MainDashboard extends Component {
  state = {
    organizations: [],
    errors: "",
  };

  dashboardPath = () => {
    return (
      <div className="float-right">
        <i className="fas fa-home" />{" "}
        <span>
          <Link className="col-on-primary" to="/">
            Home
          </Link>
        </span>{" "}
        {`>`} <span>Dashboard</span>
      </div>
    );
  };

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

  componentDidMount() {
    this.fetchOrganizationsAPI();
  }

  render() {
    return (
      <DashboardContainer>
        {this.dashboardPath()}
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
