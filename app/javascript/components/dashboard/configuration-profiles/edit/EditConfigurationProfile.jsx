import React, { Component } from "react";
import { Link } from "react-router-dom";
import fetchConfigurationProfile from "../../../../services/fetchConfigurationProfile";
import AlertNotice from "../../../shared/AlertNotice";
import Loader from "../../../shared/Loader";
import DashboardContainer from "../../DashboardContainer";

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
        </span>
        <span>Edit</span>
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
            <div className="row h-50 ml-5">
              <h1>{`Configuration Profile ${configurationProfile.name}`}</h1>
            </div>
          </div>
        )}
      </DashboardContainer>
    );
  }
}
