import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AlertNotice from "../../shared/AlertNotice";

class UploadConfigurationProfile extends Component {
  state = {
    errors: [],
  };

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

  render() {
    const { errors } = this.state;

    return (
      <DashboardContainer>
        {this.dashboardPath()}

        <div className="col mt-5">
          {errors.length > 0 && <AlertNotice message={errors} />}
          <div className="row h-50 ml-5">
            <h1>Upload your configuration profile</h1>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}

export default UploadConfigurationProfile;
