import React, { Fragment, useEffect, useState } from "react";
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
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setStep,
} from "../../../../actions/configurationProfiles";
import { camelizeKeys } from "humps";

const EditConfigurationProfile = (props) => {
  const [loading, setLoading] = useState(true);
  const errors = useSelector((state) => state.editCPErrors);

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
        dispatch(setEditCPErrors(response.error));
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

  useEffect(() => {
    dispatch(setEditCPErrors(null));
    dispatch(setStep(1));
    fetchCP();
  }, []);

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
              <div className="card border-top-dashboard-highlight h-100">
                <div className="card-body d-flex flex-column">
                  <div className="row justify-content-center">
                    <CPCardHeader />
                  </div>
                  <div className="row justify-content-center">
                    <PageStepRenderer />
                  </div>
                  <div className="row mt-auto ml-auto">
                    <PrevNextButtons />
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

const CPCardHeader = () => {
  const configurationProfile = useSelector((state) => state.currentCP);
  const savingCP = useSelector((state) => state.savingCP);

  return (
    <Fragment>
      <div className="col-4">
        <h3 className="float-left">
          {_.capitalize(configurationProfile.name)}
        </h3>
      </div>
      <div className="col-4">
        <p className="text-center col-on-primary-light">
          {savingCP ? "Saving ..." : "All changes saved"}
        </p>
      </div>
      <div className="col-4">
        <p
          className="float-right"
          style={stateStyle(configurationProfile.state)}
        >
          {_.capitalize(configurationProfile.state)}
        </p>
      </div>
    </Fragment>
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

const PrevNextButtons = () => {
  const currentStep = useSelector((state) => state.cpStep);
  const dispatch = useDispatch();

  return (
    <Fragment>
      {currentStep !== 1 && (
        <button
          className="btn btn-dark mr-3"
          style={{ width: "10rem" }}
          onClick={() => {
            dispatch(setStep(currentStep - 1));
          }}
        >
          Previous
        </button>
      )}
      {currentStep !== 4 && (
        <button
          className="btn btn-dark mr-3"
          style={{ width: "10rem" }}
          onClick={() => {
            dispatch(setStep(currentStep + 1));
          }}
        >
          Next
        </button>
      )}
    </Fragment>
  );
};

export default EditConfigurationProfile;
