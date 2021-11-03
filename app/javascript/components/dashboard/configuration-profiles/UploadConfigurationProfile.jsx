import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AlertNotice from "../../shared/AlertNotice";
import { downloadFile } from "../../../helpers/Export";
import fetchValidSchema from "../../../services/fetchValidSchema";

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

  render() {
    const { errors } = this.state;

    return (
      <DashboardContainer>
        {this.dashboardPath()}

        <div className="col mt-5">
          {errors.length ? <AlertNotice message={errors} /> : ""}
          <div className="row h-50 ml-5">
            <div
              className="card"
              style={{
                transform: "translate(50%, 25%)",
                maxWidth: "50%",
                borderRadius: "10px",
              }}
            >
              <div className="card-header">
                <div className="row">
                  <div className="col">
                    <h1 className="col-dashboard-highlight text-center">
                      Upload your configuration profile
                    </h1>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <p
                      className="text-center mb-5"
                      style={{ fontStyle: "italic" }}
                    >
                      Please specify the origin of the configuration profile
                      structure. Remember it must match{" "}
                      <span
                        class="cursor-pointer col-dashboard-highlight text-underlne"
                        onClick={this.handleDownloadSchema}
                      >
                        this JSON Schema
                      </span>
                      .
                    </p>

                    <div className="upload-zone"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}

export default UploadConfigurationProfile;
