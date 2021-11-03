import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AlertNotice from "../../shared/AlertNotice";
import { downloadFile } from "../../../helpers/Export";
import fetchValidSchema from "../../../services/fetchValidSchema";
import { CenteredRoundedCard } from "./utils";

const UploadZone = (props) => {
  return (
    <div className="mt-5">
      <h2>Upload here!</h2>
    </div>
  );
};

class UploadConfigurationProfile extends Component {
  state = {
    errors: [],
  };

  anyError(response, errorsList = this.state.errors) {
    if (response.error) {
      errorsList.push(response.error);
      this.setState({
        errors: [...new Set(errorsList)],
      });
    }
    return !_.isUndefined(response.error);
  }

  dashboardPath = () => {
    return (
      <div className="float-right">
        <FontAwesomeIcon icon={faHome} />{" "}
        <span>
          <Link className="col-on-primary" to="/">
            Home
          </Link>
        </span>{" "}
        {`>`}{" "}
        <span>
          <Link className="col-on-primary" to="/dashboard">
            Dashboard
          </Link>
        </span>{" "}
        {`>`} <span>New Configuration Profile</span>
      </div>
    );
  };

  handleDownloadSchema = async () => {
    let response = await fetchValidSchema();

    if (!this.anyError(response)) {
      downloadFile(response.validSchema);
    }
  };

  cardSubtitle = () => {
    return (
      <p className="text-center mb-5" style={{ fontStyle: "italic" }}>
        Please specify the origin of the configuration profile structure.
        Remember it must match{" "}
        <u
          class="cursor-pointer col-dashboard-highlight text-underlne"
          onClick={this.handleDownloadSchema}
        >
          this JSON Schema
        </u>
        .
      </p>
    );
  };

  render() {
    const { errors } = this.state;

    return (
      <DashboardContainer>
        {this.dashboardPath()}

        <div className="col mt-5">
          {errors.length ? <AlertNotice message={errors} /> : ""}
          <div className="row h-50 ml-5">
            <CenteredRoundedCard
              title="Upload your configuration profile"
              subtitle={this.cardSubtitle()}
            >
              <UploadZone />
            </CenteredRoundedCard>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}

export default UploadConfigurationProfile;
