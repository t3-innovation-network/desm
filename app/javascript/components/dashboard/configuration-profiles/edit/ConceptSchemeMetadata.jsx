import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";

const ConceptSchemeMetadata = (props) => {
  const { schemaFileIdx, conceptSchemeIdx } = props;
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const schemaFiles =
    currentCP.structure.standardsOrganizations[currentDSOIndex]
      .associatedSchemas || [];
  const schemaFile = schemaFiles[schemaFileIdx] || {};
  const conceptScheme =
    schemaFile.associatedConceptSchemes[conceptSchemeIdx] || {};

  const [fileName, setFileName] = useState(conceptScheme?.name || "");
  const [fileVersion, setFileVersion] = useState(conceptScheme?.version || "");
  const [description, setDescription] = useState(
    conceptScheme?.description || ""
  );
  const [origin, setOrigin] = useState(conceptScheme?.origin || "");
  const dispatch = useDispatch();

  const handleBlur = () => {
    let localCP = currentCP;
    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      schemaFileIdx
    ].associatedConceptSchemes[conceptSchemeIdx] = {
      name: fileName,
      version: fileVersion,
      description: description,
      origin: origin,
    };

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
    setFileName(conceptScheme.name);
    setFileVersion(conceptScheme.version);
    setDescription(conceptScheme.description);
    setOrigin(conceptScheme.origin);
  }, [props]);

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

export default ConceptSchemeMetadata;
