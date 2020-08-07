import React from "react";
import DashboardContainer from "./DashboardContainer";
import fetchOrganizations from "../../services/fetchOrganizations"
import ErrorNotice from "../shared/ErrorNotice";
import ErrorMessage from "../shared/ErrorMessage";
import OrganizationInfo from "./organizations/OrganizationInfo";

export default class MainDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      organizations: [],
      errors: ""
    }
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
          errors: ErrorMessage(error),
        });
      });
  }

  componentDidMount() {
    this.fetchOrganizationsAPI();
  }

  render() {
    return (
      <DashboardContainer>
        <div className="col-lg-8 mx-auto mt-5">
          {this.state.errors && <ErrorNotice message={this.state.errors} />}

          { this.state.organizations.map((o) => {
            return <OrganizationInfo organization={o} key={o.id} />
          }) }

        </div>
      </DashboardContainer>
    );
  }
}
