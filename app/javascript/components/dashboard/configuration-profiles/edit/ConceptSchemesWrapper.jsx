import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";
import ConfirmDialog from "../../../shared/ConfirmDialog";
import {
  NoDataFound,
  SmallAddTabBtn,
  SmallRemovableTab,
  TabGroup,
} from "../utils";
import ConceptSchemeMetadata from "./ConceptSchemeMetadata";

const ConceptSchemesWrapper = (props) => {
  const { schemaFileIdx } = props;
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const schemaFiles =
    currentCP.structure.standardsOrganizations[currentDSOIndex]
      .associatedSchemas || [];
  const schemaFile = schemaFiles[schemaFileIdx] || {};
  const conceptSchemes = schemaFile.associatedConceptSchemes || [];
  const [activeTab, setActiveTab] = useState(0);
  const [idxToRemove, setIdxToRemove] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const confirmationMsg = `Please confirm if you really want to remove the concept scheme file ${conceptSchemes[idxToRemove]?.name}`;
  const dispatch = useDispatch();

  const conceptSchemeBtns = () => {
    return conceptSchemes.map((file, idx) => {
      return (
        <SmallRemovableTab
          active={activeTab === idx}
          key={idx}
          removeClickHandler={() => {
            setIdxToRemove(idx);
            setConfirmationVisible(true);
          }}
          tabClickHandler={() => setActiveTab(idx)}
          text={file.name || ""}
          tooltipMsg={`View/Edit ${file.name || ""}`}
        />
      );
    });
  };

  const handleAddConceptScheme = () => {
    let localCP = currentCP;
    let localFiles = [
      ...conceptSchemes,
      {
        name: `Concept Scheme ${conceptSchemes.length + 1}`,
        version: "",
        description: "",
        origin: "",
      },
    ];

    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      schemaFileIdx
    ].associatedConceptSchemes = localFiles;

    dispatch(setCurrentConfigurationProfile(localCP));
    save(localCP);
    setActiveTab(localFiles.length - 1);
  };

  const handleRemoveConceptScheme = () => {
    setConfirmationVisible(false);
    let localCP = currentCP;

    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      schemaFileIdx
    ].associatedConceptSchemes.splice(idxToRemove, 1);

    setActiveTab(0);
    dispatch(setCurrentConfigurationProfile(localCP));
    save(localCP);
  };

  const save = (cp) => {
    dispatch(setSavingCP(true));

    updateCP(currentCP.id, cp).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }
      dispatch(setSavingCP(false));
    });
  };

  useEffect(() => {
    setActiveTab(0);
  }, [props]);

  return (
    <Fragment>
      {confirmationVisible && (
        <ConfirmDialog
          onRequestClose={() => setConfirmationVisible(false)}
          onConfirm={() => handleRemoveConceptScheme()}
          visible={confirmationVisible}
        >
          <h2 className="text-center">Attention!</h2>
          <h5 className="mt-3 text-center">{confirmationMsg}</h5>
        </ConfirmDialog>
      )}
      <div className="mt-5 ml-3">
        <TabGroup>
          {conceptSchemeBtns()}{" "}
          {<SmallAddTabBtn onClickHandler={handleAddConceptScheme} />}{" "}
        </TabGroup>
      </div>
      {conceptSchemes.length ? (
        <div className="mt-5">
          <ConceptSchemeMetadata
            schemaFileIdx={schemaFileIdx}
            conceptSchemeIdx={activeTab}
          />
        </div>
      ) : (
        <NoDataFound
          text={`The Schema File ${schemaFile.name} does not have any concept scheme files declared yet. You can add one by clicking on the "+" button`}
        />
      )}
    </Fragment>
  );
};

export default ConceptSchemesWrapper;
