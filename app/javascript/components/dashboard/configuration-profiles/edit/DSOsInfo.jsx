import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setCurrentDSOIndex,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import DSOInfoWrapper from "./DSOInfoWrapper";
import updateCP from "../../../../services/updateCP";
import { AddTabBtn, NoDataFound, RemovableTab, TabGroup } from "../utils";

const DSOTab = (props) => {
  const { active, dso, onClickHandler, onRemoveHandler } = props;

  return (
    <RemovableTab
      active={active}
      removeClickHandler={onRemoveHandler}
      tabClickHandler={onClickHandler}
      title={dso.name}
    />
  );
};

const DSOsInfo = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDsoIndex = useSelector((state) => state.currentDSOIndex);
  const dispatch = useDispatch();
  const getDsos = () => currentCP.structure.standardsOrganizations || [];

  const addDso = () => {
    let localCP = currentCP;
    let newIdx = localCP.structure.standardsOrganizations?.length || 0;
    localCP.structure.standardsOrganizations = [
      ...getDsos(),
      {
        email: "",
        name: `DSO ${getDsos().length + 1}`,
        dsoAdministrator: null,
        dsoAgents: [],
        associatedSchemas: [],
      },
    ];

    dispatch(setCurrentConfigurationProfile(localCP));
    dispatch(setCurrentDSOIndex(newIdx));
    save();
  };

  const dsoTabs = () => {
    return getDsos().map((dso, index) => {
      return (
        <DSOTab
          active={index === currentDsoIndex}
          dso={dso}
          key={index}
          onClickHandler={() => dispatch(setCurrentDSOIndex(index))}
          onRemoveHandler={() => removeDSO(index)}
        />
      );
    });
  };

  const removeDSO = (index) => {
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
        <TabGroup cssClass={"ml-3 mr-3"}>
          {getDsos().length ? dsoTabs() : ""}
          <AddTabBtn
            onClickHandler={() => addDso()}
            tooltipMsg={"Create a new DSO for this Configuration Profile"}
          />
        </TabGroup>
      </div>
      {getDsos().length ? (
        <div className="mt-5 w-100">
          <DSOInfoWrapper />
        </div>
      ) : (
        <div className="mt-5">
          {
            <NoDataFound
              text={`This Configuration Profile didn't provide any DSO information yet. You can add one clicking on the "+" button`}
            />
          }
        </div>
      )}
    </Fragment>
  );
};

export default DSOsInfo;
