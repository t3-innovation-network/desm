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
  const { active, dso, onClickHandler } = props;

  return (
    <span
      className={`${
        active
          ? "dashboard-active-tab border-left border-right"
          : "border bg-col-on-primary-light col-background"
      } rounded cursor-pointer pl-5 pr-5 pt-3 pb-3 text-center`}
    >
      {dso.name}
      <span
        className="font-weight-bold"
        onClick={onClickHandler}
        style={{ position: "relative", top: "-10px", left: "30px" }}
      >
        x
      </span>
    </span>
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
        <span
          className="w-25"
          key={index}
          onClick={() => dispatch(setCurrentDSOIndex(index))}
        >
          <DSOTab
            active={index === currentDsoIndex}
            dso={dso}
            onClickHandler={(event) => removeDSO(event, index)}
          />
        </span>
      );
    });
  };

  const newDso = () => {
    return (
      <span
        className="pl-5 pr-5 pt-3 pb-3 text-center border bg-col-on-primary-light col-background cursor-pointer"
        data-toggle="tooltip"
        data-placement="top"
        title={"Create a new DSO for this Configuration Profile"}
        onClick={() => addDso()}
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
        {getDsos().length ? dsoTabs() : ""}
        {newDso()}
      </div>
      {getDsos().length ? (
        <div className="mt5 w-100">
          <DSOInfoWrapper />
        </div>
      ) : (
        <div className="mt-5">{noDsoData()}</div>
      )}
    </Fragment>
  );
};

export default DSOsInfo;
