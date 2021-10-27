import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";
import {
  NoDataFound,
  SmallAddTabBtn,
  SmallRemovableTab,
  TabGroup,
} from "../utils";
import ConceptSchemeMetadata from "./ConceptSchemeMetadata";

const ConceptSchemesWrapper = (props) => {
  const { fileIdx } = props;
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const schemaFiles =
    currentCP.structure.standardsOrganizations[currentDSOIndex]
      .associatedSchemas || [];
  const schemaFile = schemaFiles[fileIdx] || {};
  const conceptSchemes = schemaFile.associatedConceptSchemes || [];
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();

  const conceptSchemeBtns = () => {
    return conceptSchemes.map((file, idx) => {
      return (
        <SmallRemovableTab
          active={activeTab === idx}
          key={idx}
          removeClickHandler={() => {}}
          tabClickHandler={() => setActiveTab(idx)}
          text={file.name || ""}
          tooltipMsg={"Click to view/edit this concept scheme file information"}
        />
      );
    });
  };

  const handleAddConceptScheme = () => {
    let localCP = currentCP;

    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      fileIdx
    ].associatedConceptSchemes = [
      ...conceptSchemes,
      {
        name: `Concept Scheme ${conceptSchemes.length + 1}`,
        version: "",
        description: "",
        origin: "",
      },
    ];

    dispatch(setCurrentConfigurationProfile(localCP));
    save(localCP);
    setActiveTab(conceptSchemes.length);
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

  return (
    <Fragment>
      <div className="mt-5 ml-3">
        <TabGroup>
          {conceptSchemeBtns()}{" "}
          {<SmallAddTabBtn onClickHandler={handleAddConceptScheme} />}{" "}
        </TabGroup>
      </div>
      {conceptSchemes.length ? (
        <div className="mt-5">
          <ConceptSchemeMetadata
            schemaFileIdx={fileIdx}
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
