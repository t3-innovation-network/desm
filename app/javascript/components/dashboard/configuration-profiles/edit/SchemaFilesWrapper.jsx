import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";
import ConfirmDialog from "../../../shared/ConfirmDialog";
import { AddTabBtn, NoDataFound, RemovableTab, TabGroup } from "../utils";
import SchemaFiles from "./SchemaFiles";

const SchemaFilesWrapper = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const getFiles = () =>
    currentCP.structure.standardsOrganizations[currentDSOIndex]
      .associatedSchemas || [];
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const confirmationMsg = `Please confirm if you really want to remove file ${
    getFiles()[activeTab]?.name
  }`;

  const handleAddFile = () => {
    let localCP = currentCP;
    let localFiles = [
      ...getFiles(),
      {
        name: `Schema File N${getFiles().length + 1}`,
        origin: "",
        description: "",
        associatedAbstractClass: "",
      },
    ];
    localCP.structure.standardsOrganizations[
      currentDSOIndex
    ].associatedSchemas = localFiles;

    dispatch(setCurrentConfigurationProfile(localCP));
    save();
  };

  const handleRemoveFile = (idx) => {
    setConfirmationVisible(false);
    let localCP = currentCP;
    localCP.structure.standardsOrganizations[
      currentDSOIndex
    ].associatedSchemas.splice(idx, 1);

    setActiveTab(0);
    dispatch(setCurrentConfigurationProfile(localCP));
    save();
  };

  const save = () => {
    dispatch(setSavingCP(true));

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

  const schemaFileTabs = () => {
    return getFiles().map((file, idx) => {
      return (
        <RemovableTab
          key={idx}
          active={idx === activeTab}
          removeClickHandler={() => {
            setActiveTab(idx);
            setConfirmationVisible(true);
          }}
          tabClickHandler={() => {
            setActiveTab(idx);
          }}
          title={file.name}
        />
      );
    });
  };

  return (
    <Fragment>
      {confirmationVisible && (
        <ConfirmDialog
          onRequestClose={() => setConfirmationVisible(false)}
          onConfirm={() => handleRemoveFile(activeTab)}
          visible={confirmationVisible}
        >
          <h2 className="text-center">Attention!</h2>
          <h5 className="mt-3 text-center">{confirmationMsg}</h5>
        </ConfirmDialog>
      )}
      <div className="mt-5 w-100">
        <TabGroup cssClass={"ml-3 mr-3"}>
          {schemaFileTabs()}
          <AddTabBtn
            onClickHandler={handleAddFile}
            tooltipMsg={"Create a new schema file for this DSO"}
          />
        </TabGroup>
      </div>
      {getFiles().length ? (
        <SchemaFiles
          file={getFiles()[activeTab]}
          idx={activeTab}
          getFiles={getFiles}
          currentCP={currentCP}
          currentDSOIndex={currentDSOIndex}
          save={save}
        />
      ) : (
        <NoDataFound
          text={`This DSO did not specify any schema files information yet. You can add a schema file by clicking on the "+" button`}
        />
      )}
    </Fragment>
  );
};

export default SchemaFilesWrapper;
