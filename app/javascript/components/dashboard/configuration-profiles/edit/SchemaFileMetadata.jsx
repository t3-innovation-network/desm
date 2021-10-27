import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";

const SchemaFileMetadata = (props) => {
  const { fileIdx } = props;
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const getFiles = () =>
    currentCP.structure.standardsOrganizations[currentDSOIndex]
      .associatedSchemas || [];
  const file = getFiles()[fileIdx] || {};

  const [abstractClass, setAbstractClass] = useState(
    file.associatedAbstractClass
  );
  const [fileName, setFileName] = useState(file.name);
  const [fileVersion, setFileVersion] = useState(file.version);
  const [description, setDescription] = useState(file.description);
  const [origin, setOrigin] = useState(file.origin);
  const dispatch = useDispatch();

  const handleBlur = () => {
    let files = getFiles();
    files[fileIdx] = {
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

  const handleUrlBlur = (
    url,
    errorMessage = "Must be a valid URL",
    blurHandler
  ) => {
    if (url === "") {
      dispatch(setEditCPErrors(null));
      blurHandler();
      return;
    }

    if (!validURL(url)) {
      dispatch(setEditCPErrors(errorMessage));
      return;
    }
    dispatch(setEditCPErrors(null));
    blurHandler();
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

  useEffect(() => {
    const { fileIdx } = props;
    setAbstractClass(file.associatedAbstractClass);
    setFileName(file.name);
    setFileVersion(file.version);
    setDescription(file.description);
    setOrigin(file.origin);
  }, [props.fileIdx]);

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
              handleUrlBlur(
                origin,
                "The origin must be a valid URL",
                handleBlur
              )
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
                "The associated abstract class must be a valid URL",
                handleBlur
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

export default SchemaFileMetadata;
