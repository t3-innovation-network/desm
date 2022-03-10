import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";
import fetchCPSkosLabels from "../../../../services/fetchCpSkosLabels";

const SchemaFileMetadata = (props) => {
  const { schemaFileIdx } = props;
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const schemaFiles =
    currentCP.structure.standardsOrganizations[currentDSOIndex]
      .associatedSchemas || [];
  const file = schemaFiles[schemaFileIdx] || {};

  const [abstractClass, setAbstractClass] = useState(
    file.associatedAbstractClass
  );
  const [fileName, setFileName] = useState(file.name);
  const [fileVersion, setFileVersion] = useState(file.version);
  const [description, setDescription] = useState(file.description);
  const [origin, setOrigin] = useState(file.origin);
  const [abstractClassesLabels, setAbstractClassesLabels] = useState([]);
  const dispatch = useDispatch();

  const handleBlur = () => {
    let files = schemaFiles;
    files[schemaFileIdx] = {
      name: fileName,
      associatedAbstractClass: abstractClass,
      description: description,
      origin: origin,
      version: fileVersion,
      associatedConceptSchemes:
        schemaFiles[schemaFileIdx].associatedConceptSchemes,
    };

    let localCP = currentCP;
    localCP.structure.standardsOrganizations[
      currentDSOIndex
    ].associatedSchemas = files;

    dispatch(setCurrentConfigurationProfile(localCP));
    save(localCP);
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

  const handleFetchAbstractClassesLabels = () => {
    fetchCPSkosLabels(currentCP.id, "json_abstract_classes").then(
      (response) => {
        if (response.error) {
          let message = response.error;
          dispatch(setEditCPErrors(message));
          return;
        }

        setAbstractClassesLabels(response.conceptNames);
      }
    );
  };

  useEffect(() => {
    setAbstractClass(file.associatedAbstractClass);
    setFileName(file.name);
    setFileVersion(file.version);
    setDescription(file.description);
    setOrigin(file.origin);
    handleFetchAbstractClassesLabels();
  }, [props.schemaFileIdx]);

  useEffect(() => {
    if (abstractClass) handleBlur();
  }, [abstractClass]);

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
        <small className="col-on-primary-light font-italic">
          Please be sure the content is in one of the following formats: CSV,
          JSON, JSONLD, RDF or XML
        </small>
      </div>

      {abstractClassesLabels.length > 0 ? (
        <div className="mt-5">
          <label>Associated Abstract Class</label>
          <div className="input-group input-group">
            <select
              className="form-control cursor-pointer"
              value={abstractClass}
              onChange={(e) => setAbstractClass(e.target.value)}
            >
              {abstractClassesLabels.map(function (option) {
                return (
                  <option
                    key={option["uri"]}
                    value={option["uri"]}
                    defaultChecked={option["uri"] === abstractClass}
                  >
                    {option["label"]}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      ) : (
        <p>
          This configuration profile has no abstract classes yet selected.
          Please go to Step 2 and select one so each schema file can be related
          to an abstract class.
        </p>
      )}
    </Fragment>
  );
};

export default SchemaFileMetadata;
