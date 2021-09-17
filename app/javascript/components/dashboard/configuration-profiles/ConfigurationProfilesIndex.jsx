import React, { Component, Fragment } from "react";
import DashboardContainer from "../DashboardContainer";
import { Link } from "react-router-dom";
import AlertNotice from "../../shared/AlertNotice";
import fetchConfigurationProfiles from "../../../services/fetchConfigurationProfiles";
import ConfigurationProfileBox, {
  CPBoxContainer,
} from "./ConfigurationProfileBox";
import { camelizeKeys } from "humps";
import ConfirmDialog from "../../shared/ConfirmDialog";
import createCP from "../../../services/createCP";

class NewConfigurationProfile extends Component {
  state = {
    confirmationVisible: false,
    confirmationMsg:
      "You are about to create a new empty Configuration Profile. You will be able to fill all the necessary information until\
       it is complete and ready to be used. Please confirm.",
  };

  handleCreate = () => {
    this.setState({ confirmationVisible: false });
    this.props.handleCreate();
  };

  render() {
    const { confirmationMsg, confirmationVisible } = this.state;
    return (
      <Fragment>
        {confirmationVisible && (
          <ConfirmDialog
            onRequestClose={() => this.setState({ confirmationVisible: false })}
            onConfirm={this.handleCreate}
            visible={confirmationVisible}
          >
            <h2 className="text-center">Attention!</h2>
            <h5 className="mt-3 text-center"> {confirmationMsg}</h5>
          </ConfirmDialog>
        )}
        <CPBoxContainer
          iconClass="fa-plus"
          sideBoxClass="bg-dashboard-background-highlight col-background"
          action={() => {
            this.setState({ confirmationVisible: true });
          }}
        >
          <h5 className="m-5">Add a Configuration Profile</h5>
        </CPBoxContainer>
      </Fragment>
    );
  }
}

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

  handleCreate = () => {
    createCP().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
        });
        return;
      }

      this.props.history.push(
        `/dashboard/configuration-profiles/${response.configurationProfile.id}`
      );
    });
  };

  render() {
    const { configurationProfiles, errors } = this.state;

    return (
      <DashboardContainer>
        {this.dashboardPath()}

        <div className="col mt-5">
          {errors && <AlertNotice message={errors} />}
          <div className="row h-50 ml-5">
            {configurationProfiles.map((cp) => {
              return (
                <ConfigurationProfileBox
                  configurationProfile={camelizeKeys(cp)}
                  key={cp.id}
                />
              );
            })}

            <NewConfigurationProfile handleCreate={this.handleCreate} />
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
