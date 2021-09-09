import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { Link } from "react-router-dom";
import AlertNotice from "../../shared/AlertNotice";
import fetchConfigurationProfiles from "../../../services/fetchConfigurationProfiles";
import ConfigurationProfileBox from "./ConfigurationProfileBox";
import { camelizeKeys } from "humps";

export default class ConfigurationProfilesIndex extends Component {
  state = {
    configurationProfiles: [],
    errors: "",
  };

  componentDidMount() {
    this.fetchConfigurationProfilesAPI();
  }

  dashboardPath = () => {
    return (
      <div className="float-right">
        <i className="fas fa-home" />{" "}
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
        {`>`} <span>Configuration Profiles</span>
      </div>
    );
  };

  fetchConfigurationProfilesAPI() {
    fetchConfigurationProfiles().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
        });
        return;
      }
      this.setState({
        configurationProfiles: response.configurationProfiles,
      });
    });
  }

  render() {
    const { configurationProfiles, errors } = this.state;

    return (
      <DashboardContainer>
        {errors && <AlertNotice message={errors} />}
        {this.dashboardPath()}

        <div className="col col-md-10 mt-5">
          <div className="row h-50 ml-5">
            {errors && <AlertNotice message={errors} />}

            {configurationProfiles.map((cp) => {
              return (
                <ConfigurationProfileBox
                  configurationProfile={camelizeKeys(cp)}
                  key={cp.id}
                />
              );
            })}
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
