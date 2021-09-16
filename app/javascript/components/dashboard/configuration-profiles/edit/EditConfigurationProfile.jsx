import React, { Component } from "react";
import { Link } from "react-router-dom";
import fetchConfigurationProfile from "../../../../services/fetchConfigurationProfile";
import AlertNotice from "../../../shared/AlertNotice";
import Loader from "../../../shared/Loader";
import DashboardContainer from "../../DashboardContainer";
import StepsAside from "./StepsAside";

export default class EditConfigurationProfile extends Component {
  state = {
    configurationProfile: {},
    configurationProfileId: this.props.match.params.id,
    errors: "",
    loading: true,
  };

  fetchCP = () => {
    const { configurationProfileId } = this.state;

    fetchConfigurationProfile(configurationProfileId).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
          loading: false,
        });
        return;
      }

      this.setState({
        configurationProfile: response.configurationProfile,
        loading: false,
      });
    });
  };

  componentDidMount() {
    console.log("mounted");
    this.fetchCP();
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
        {`>`}{" "}
        <span>
          <Link
            className="col-on-primary"
            to="/dashboard/configuration-profiles"
          >
            Configuration Profiles
          </Link>
        </span>{" "}
        {`>`} <span>Edit</span>
      </div>
    );
  };

  render() {
    const { configurationProfile, errors, loading } = this.state;

    return (
      <DashboardContainer>
        {this.dashboardPath()}

        {loading ? (
          <Loader />
        ) : (
          <div className="col mt-5">
            {errors && <AlertNotice message={errors} />}
            <div className="row cp-container justify-content-center h-100">
              <div className="col-3">
                <StepsAside />
              </div>
              <div className="col-9">
                <div className="card border-top-dashboard-highlight">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <h3 className="float-left">
                          {_.capitalize(configurationProfile.name)}
                        </h3>
                      </div>
                      <div className="col-6">
                        <p className="float-right col-primary">
                          {_.capitalize(configurationProfile.state)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardContainer>
    );
  }
}
