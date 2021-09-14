import React, { Component } from "react";
import DashboardContainer from "../DashboardContainer";
import { Link } from "react-router-dom";
import AlertNotice from "../../shared/AlertNotice";
import fetchConfigurationProfiles from "../../../services/fetchConfigurationProfiles";
import ConfigurationProfileBox from "./ConfigurationProfileBox";
import { camelizeKeys } from "humps";

export const CPBoxContainer = (props) => {
  const { children, iconClass, sideBoxClass } = props;
  const action = props.action || (() => {});

  return (
    <div className="card mb-3 mr-3" style={{ maxWidth: "540px" }}>
      <div className="row no-gutters" style={{ height: "130px" }}>
        <div
          className={"col-md-4 p-5 cursor-pointer " + (sideBoxClass || "")}
          style={{ height: "130px" }}
          onClick={action}
        >
          <i
            className={`fas ${iconClass} fa-3x`}
            style={{ transform: "translateY(30%) translateX(10%)" }}
          ></i>
        </div>
        <div className="col-md-8">{children}</div>
      </div>
    </div>
  );
};

const NewConfigurationProfile = () => {
  const handleCreate = () => {
    console.log("Creating a new Configuration Profile");
  };

  return (
    <CPBoxContainer
      iconClass="fa-plus"
      sideBoxClass="bg-dashboard-background-highlight col-background"
      action={handleCreate}
    >
      <h5 className="m-5">Add a Configuration Profile</h5>
    </CPBoxContainer>
  );
};

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

            <NewConfigurationProfile />
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
