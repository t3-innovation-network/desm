import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
} from "../../../../actions/configurationProfiles";
import { validURL } from "../../../../helpers/URL";
import { RemovableTab, TabGroup } from "../utils";
import ConceptSchemes from "./ConceptSchemes";

const SchemaFiles = (props) => {
  const { currentCP, currentDSOIndex, file, getFiles, idx, save } = props;
  const [abstractClass, setAbstractClass] = useState(
    file.associatedAbstractClass
  );
  const [fileName, setFileName] = useState(file.name);
  const [fileVersion, setFileVersion] = useState(file.version);
  const [description, setDescription] = useState(file.description);
  const [origin, setOrigin] = useState(file.origin);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  const handleBlur = () => {
    let files = getFiles();
    files[idx] = {
      name: fileName,
      associatedAbstractClass: abstractClass,
      description: description,
      origin: origin,
      version: fileVersion,
    };

    let localCP = currentCP;
    localCP.structure.standardsOrganizations[
      currentDSOIndex
    ].associatedSchemas = files;

    dispatch(setCurrentConfigurationProfile(localCP));
    save();
  };

  const handleUrlBlur = (url, errorMessage = "Must be a valid URL") => {
    if (!validURL(url)) {
      dispatch(setEditCPErrors(errorMessage));
      return;
    }
    dispatch(setEditCPErrors(null));
    handleBlur();
  };

  const metadata = () => {
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
              placeholder="The name of the schema file"
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
              placeholder="The version of the schema file"
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
              placeholder="A detailed description of the schema file. E.g. what it represents, which concepts should be expected it to contain."
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
                handleUrlBlur(origin, "The origin must be a valid URL")
              }
              pattern="https://.*"
              size="30"
              placeholder="https://example.com"
              required
            />
          </div>
        </div>

        <div className="mt-5">
          <label>Associated Abstract Class</label>
          <div className="input-group input-group">
            <input
              type="url"
              className="form-control input-lg"
              name="origin"
              value={abstractClass}
              onChange={(event) => {
                setAbstractClass(event.target.value);
              }}
              onBlur={() =>
                handleUrlBlur(
                  abstractClass,
                  "The associated abstract class must be a valid URL"
                )
              }
              pattern="https://.*"
              size="30"
              placeholder="https://example.com"
              required
            />
          </div>
        </div>
      </Fragment>
    );
  };

  useEffect(() => {
    const { file } = props;
    setAbstractClass(file.associatedAbstractClass);
    setFileName(file.name);
    setFileVersion(file.version);
    setDescription(file.description);
    setOrigin(file.origin);
  }, [props.file]);

  return (
    <Fragment>
      <div className="w-100">
        <TabGroup cssClass={"ml-3 mr-3"} controlledSize={false}>
          <RemovableTab
            active={0 === activeTab}
            tabClickHandler={() => {
              setActiveTab(0);
            }}
            title={"MetaData"}
            showCloseBtn={false}
          />
          <RemovableTab
            active={1 === activeTab}
            tabClickHandler={() => {
              setActiveTab(1);
            }}
            title={"Concept Schemes"}
            showCloseBtn={false}
          />
        </TabGroup>
      </div>
      <div className="col">
        {activeTab === 0 ? (
          metadata()
        ) : (
          <ConceptSchemes files={file.associatedConceptSchemes || []} />
        )}
      </div>
    </Fragment>
  );
};

export default SchemaFiles;
