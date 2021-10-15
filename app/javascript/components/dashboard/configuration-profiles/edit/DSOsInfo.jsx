import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import noDsoDataImg from "./../../../../../assets/images/no-data-found.png";
import {
  setCurrentConfigurationProfile,
  setCurrentDSOIndex,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import DSOInfoWrapper from "./DSOInfoWrapper";
import updateCP from "../../../../services/updateCP";

const DSOTab = (props) => {
  const { active, dso, onClickHandler, onRemoveHandler } = props;

  return (
    <div
      className={`col ${
        active
          ? "dashboard-active-tab border-left border-right"
          : "border bg-col-on-primary-light col-background"
      } rounded cursor-pointer pl-2 pr-2 pt-3 pb-3 text-center`}
      onClick={onClickHandler}
      style={{ height: "50px", overflow: "hidden", textOverflow: "ellipsis" }}
    >
      {dso.name}
      <span
        className="font-weight-bold"
        onClick={onRemoveHandler}
        style={{ position: "absolute", top: "0px", right: "10px" }}
      >
        x
      </span>
    </div>
  );
};

const noDsoData = () => {
  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <img src={noDsoDataImg} alt="No data found" />
      </div>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <p>No DSO Data specified. You can add one clicking on the "+" button</p>
      </div>
    </Fragment>
  );
};

const DSOsInfo = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDsoIndex = useSelector((state) => state.currentDSOIndex);
  const dispatch = useDispatch();
  const getDsos = () => currentCP.structure.standardsOrganizations || [];

  const addDso = () => {
    let localCP = currentCP;
    localCP.structure.standardsOrganizations = [
      ...getDsos(),
      {
        email: "",
        name: `DSO ${getDsos().length}`,
        dsoAdministrator: null,
        dsoAgents: [],
        associatedSchemas: [],
      },
    ];

    dispatch(setCurrentConfigurationProfile(localCP));
    dispatch(setCurrentDSOIndex(0));
  };

  const dsoTabs = () => {
    return getDsos().map((dso, index) => {
      return (
        <DSOTab
          active={index === currentDsoIndex}
          dso={dso}
          key={index}
          onClickHandler={() => dispatch(setCurrentDSOIndex(index))}
          onRemoveHandler={(event) => removeDSO(event, index)}
        />
      );
    });
  };

  const newDso = () => {
    return (
      <span
        className="col pl-3 pr-3 pt-3 pb-3 text-center border rounded bg-dashboard-background-highlight col-background font-weight-bold cursor-pointer"
        data-toggle="tooltip"
        data-placement="top"
        title={"Create a new DSO for this Configuration Profile"}
        onClick={() => addDso()}
        style={{ maxWidth: "50px", fontSize: "large", height: "50px" }}
      >
        +
      </span>
    );
  };

  const removeDSO = (event, index) => {
    event.stopPropagation();
    let localCP = currentCP;
    localCP.structure.standardsOrganizations.splice(index, 1);

    dispatch(setCurrentConfigurationProfile(localCP));
    save();
  };

  const save = () => {
    dispatch(setSavingCP(true));
    dispatch(setCurrentDSOIndex(0));

    updateCP(currentCP.id, currentCP).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
    });
  };

  return (
    <Fragment>
      <div className="mt-5 w-100">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 ml-3 mr-3">
          {getDsos().length ? dsoTabs() : ""}
          {newDso()}
        </div>
      </div>
      {getDsos().length ? (
        <div className="mt-5 w-100">
          <DSOInfoWrapper />
        </div>
      ) : (
        <div className="mt-5">{noDsoData()}</div>
      )}
    </Fragment>
  );
};

export default DSOsInfo;
