import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchConfigurationProfile from "../../../../services/fetchConfigurationProfile";
import AlertNotice from "../../../shared/AlertNotice";
import Loader from "../../../shared/Loader";
import DashboardContainer from "../../DashboardContainer";
import { stateStyle } from "../utils";
import StepsAside from "./StepsAside";
import DSOMetaData from "./DSOMetaData";
import MappingPredicates from "./MappingPredicates";
import AbstractClasses from "./AbstractClasses";
import DSOsInfo from "./DSOsInfo";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentConfigurationProfile } from "../../../../actions/configurationProfiles";
import { camelizeKeys } from "humps";

const EditConfigurationProfile = (props) => {
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCP();
  }, []);

  const configurationProfile = useSelector((state) => state.currentCP);

  const dashboardPath = () => {
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

  const dispatch = useDispatch();

  const fetchCP = () => {
    fetchConfigurationProfile(props.match.params.id).then((response) => {
      if (response.error) {
        setErrors(response.error);
        setLoading(false);
        return;
      }

      dispatch(
        setCurrentConfigurationProfile(
          camelizeKeys(response.configurationProfile)
        )
      );
      setLoading(false);
    });
  };

  return (
    <DashboardContainer>
      {dashboardPath()}

      {loading ? (
        <Loader />
      ) : (
        <div className="col mt-5">
          {errors && <AlertNotice message={errors} />}
          <div className="row cp-container justify-content-center h-100">
            <div className="col-3">
              <div className="row justify-content-center h-100">
                <div className="col">
                  <StepsAside />
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="card border-top-dashboard-highlight">
                <div className="card-body">
                  <div className="row justify-content-center h-100">
                    <div className="col-6">
                      <h3 className="float-left">
                        {_.capitalize(configurationProfile.name)}
                      </h3>
                    </div>
                    <div className="col-6">
                      <p
                        className="float-right"
                        style={stateStyle(configurationProfile.state)}
                      >
                        {_.capitalize(configurationProfile.state)}
                      </p>
                    </div>
                  </div>
                  <div className="row justify-content-center h-100">
                    <PageStepRenderer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardContainer>
  );
};

const PageStepRenderer = () => {
  const currentStep = useSelector((state) => state.cpStep);

  switch (currentStep) {
    case 1:
      return <DSOMetaData />;
      break;
    case 2:
      return <MappingPredicates />;
      break;
    case 3:
      return <AbstractClasses />;
      break;
    case 4:
      return <DSOsInfo />;
      break;
    default:
      return <DSOMetaData />;
      break;
  }
};

export default EditConfigurationProfile;
