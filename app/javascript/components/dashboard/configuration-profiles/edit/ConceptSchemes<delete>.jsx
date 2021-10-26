import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentConfigurationProfile } from "../../../../actions/configurationProfiles";
import {
  NoDataFound,
  SmallAddTabBtn,
  SmallRemovableTab,
  TabGroup,
} from "../utils";

const ConceptSchemes = (props) => {
  const {
    currentDSOIndex,
    currentCP,
    handleUrlBlur,
    save,
    schemaFileIdx,
  } = props;
  const [files, setFiles] = useState(props.files || []);
  const [activeTab, setActiveTab] = useState(0);
  const [fileName, setFileName] = useState(files[activeTab]?.name || "");
  const [fileVersion, setFileVersion] = useState(
    files[activeTab]?.version || ""
  );
  const [description, setDescription] = useState(
    files[activeTab]?.description || ""
  );
  const [origin, setOrigin] = useState(files[activeTab]?.origin || "");
  const dispatch = useDispatch();

  const conceptSchemeBtns = () => {
    return files.map((file, idx) => {
      return (
        <SmallRemovableTab
          active={activeTab === idx}
          key={idx}
          removeClickHandler={() => {}}
          tabClickHandler={() => setActiveTab(idx)}
          text={file.name}
          tooltipMsg={"Click to view/edit this concept scheme file information"}
        />
      );
    });
  };

  const handleAddConceptScheme = () => {
    console.log("adding concept scheme...");
    let localCP = currentCP;
    let currentFiles =
      localCP.structure.standardsOrganizations[currentDSOIndex]
        .associatedSchemas[schemaFileIdx].associatedConceptSchemes || [];

    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      schemaFileIdx
    ].associatedConceptSchemes = [
      ...currentFiles,
      {
        name: `Concept Scheme ${currentFiles.length + 1}`,
        version: "",
        description: "",
        origin: "",
      },
    ];

    dispatch(setCurrentConfigurationProfile(localCP));
    save();
    setActiveTab(currentFiles.length + 1);
  };

  const handleBlur = () => {
    let localCP = currentCP;
    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      schemaFileIdx
    ].associatedConceptSchemes[activeTab] = {
      name: fileName,
      version: fileVersion,
      description: description,
      origin: origin,
    };

    dispatch(setCurrentConfigurationProfile(localCP));
    save();
  };

  const currentFileInfo = () => {
    return (
      <Fragment>
        <div className="mt-5">
          <label>
            File Name
            <span className="text-danger">*</span>
          </label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="filename"
              placeholder="The name of the concept scheme file"
              value={fileName || ""}
              onChange={(event) => {
                setFileName(event.target.value);
              }}
              onBlur={handleBlur}
              autoFocus
            />
          </div>
        </div>

        <div className="mt-5">
          <label>Version</label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="version"
              placeholder="The version of the concept scheme file"
              value={fileVersion || ""}
              onChange={(event) => {
                setFileVersion(event.target.value);
              }}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="mt-5">
          <label>Description</label>
          <div className="input-group input-group">
            <textarea
              className="form-control input-lg"
              name="description"
              placeholder="A detailed description of the concept scheme file. E.g. what it represents, which concepts should be expected it to contain."
              value={description || ""}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              style={{ height: "10rem" }}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="mt-5">
          <label>Origin (URL)</label>
          <div className="input-group input-group">
            <input
              type="url"
              className="form-control input-lg"
              name="origin"
              value={origin}
              onChange={(event) => {
                setOrigin(event.target.value);
              }}
              onBlur={() =>
                handleUrlBlur(
                  origin,
                  "The origin must be a valid URL",
                  handleBlur
                )
              }
              pattern="https://.*"
              size="30"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </Fragment>
    );
  };

  useEffect(() => {
    const { files } = props;
    if (files.length <= 0) {
      return;
    }

    setFileName(files[activeTab].name);
    setFileVersion(files[activeTab].version);
    setDescription(files[activeTab].description);
    setOrigin(files[activeTab].origin);
  }, [activeTab]);

  return (
    <Fragment>
      <div className="mt-5 ml-3">
        <TabGroup>
          {conceptSchemeBtns()}{" "}
          {<SmallAddTabBtn onClickHandler={handleAddConceptScheme} />}{" "}
        </TabGroup>
      </div>
      {files.length ? (
        currentFileInfo()
      ) : (
        <NoDataFound
          text={`This DSO does not have any concept scheme files declared yet. You can add an agent clicking on the "+" button`}
        />
      )}
    </Fragment>
  );
};

export default ConceptSchemes;
