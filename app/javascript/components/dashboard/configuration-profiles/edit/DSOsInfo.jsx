import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DSOMetaData from "./DSOMetadata";
import noDsoDataImg from "./../../../../../assets/images/no-data-found.png";
import {
  setCurrentConfigurationProfile,
  setCurrentDSOIndex,
} from "../../../../actions/configurationProfiles";

const DSOTab = (props) => {
  const { active, dso } = props;

  return (
    <span
      className={`${
        active
          ? "dashboard-active-tab border-left border-right"
          : "border bg-col-on-primary-light col-background"
      } rounded cursor-pointer pl-5 pr-5 pt-3 pb-3 text-center`}
    >
      {dso.name}
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
    dispatch(setCurrentDSOIndex(getDsos().length - 1));
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

  const dsoTabs = () => {
    return getDsos().map((dso, index) => {
      return (
        <span
          className="w-25"
          key={index}
          onClick={() => dispatch(setCurrentDSOIndex(index))}
        >
          <DSOTab active={index === currentDsoIndex} dso={dso} />
        </span>
      );
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
          <DSOMetaData dsoData={getDsos()[currentDsoIndex]} />
        </div>
      ) : (
        <div className="mt-5">{noDsoData()}</div>
      )}
    </Fragment>
  );
};

export default DSOsInfo;
