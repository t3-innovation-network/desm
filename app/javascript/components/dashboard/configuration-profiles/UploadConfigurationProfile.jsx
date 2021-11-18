import React, { Component, useState } from "react";
import DashboardContainer from "../DashboardContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AlertNotice from "../../shared/AlertNotice";
import { downloadFile } from "../../../helpers/Export";
import fetchValidSchema from "../../../services/fetchValidSchema";
import { CenteredRoundedCard, ToggleBtn } from "./utils";
import UploadConfigurationProfileForm from "./UploadConfigurationProfileForm";

const UploadByUrlForm = () => {
  return (
    <div className="col">
      <h2>Upload a file from a URL</h2>
    </div>
  );
};

const UploadZone = () => {
  const [mode, setMode] = useState("upload");

  const uploadForm = () => {
    return mode === "upload" ? (
      <UploadConfigurationProfileForm />
    ) : (
      <UploadByUrlForm />
    );
  };

  return (
    <div className="mt-5">
      <div className="col mr-3 mt-3">
        <div
          className="row align-items-center justify-content-center"
          style={{ minWidth: "130px" }}
        >
          <ToggleBtn
            active={mode === "upload"}
            onClick={() => setMode("upload")}
            text={"File Upload"}
          />
          <ToggleBtn
            active={mode === "url"}
            onClick={() => setMode("url")}
            text={"Fetch By Url"}
          />
        </div>
        <div className="row">{uploadForm()}</div>
      </div>
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
        {`>`} <span>Configuration Profiles</span> {`>`} <span>New</span>
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
          className="cursor-pointer col-dashboard-highlight text-underlne"
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
          <div className="row h-50 justify-content-center mt-5">
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
