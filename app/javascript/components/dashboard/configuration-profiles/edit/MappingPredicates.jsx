import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import updateCP from "../../../../services/updateCP";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import { camelizeKeys } from "humps";
import { validURL } from "../../../../helpers/URL";

const MappingPredicates = () => {
  const configurationProfile = useSelector((state) => state.currentCP);
  const [filename, setFilename] = useState(
    configurationProfile.structure.mappingPredicates?.name || ""
  );
  const [version, setVersion] = useState(
    configurationProfile.structure.mappingPredicates?.version || ""
  );
  const [description, setDescription] = useState(
    configurationProfile.structure.mappingPredicates?.description || ""
  );
  const [origin, setOrigin] = useState(
    configurationProfile.structure.mappingPredicates?.origin || ""
  );
  const dispatch = useDispatch();

  const buildCpData = () => {
    let localCP = configurationProfile;
    localCP.structure.mappingPredicates = {
      name: filename,
      version: version,
      description: description,
      origin: origin,
    };

    return localCP;
  };

  const handleUrlBlur = () => {
    if (!validURL(origin)) {
      dispatch(
        setEditCPErrors("The abstract classes origin must be a valid URL")
      );
      return;
    }
    dispatch(setEditCPErrors(null));
    handleBlur();
  };

  const handleBlur = () => {
    dispatch(setSavingCP(true));

    updateCP(configurationProfile.id, buildCpData()).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(
        setCurrentConfigurationProfile(
          camelizeKeys(response.configurationProfile)
        )
      );
      dispatch(setSavingCP(false));
    });
  };

  return (
    <div className="col">
      <div className="mt-5">
        <label>
          File Name
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            name="name"
            placeholder="Give a descriptive name for the configuration profile"
            value={filename || ""}
            onChange={(event) => {
              setFilename(event.target.value);
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
            placeholder="The version of the skos file"
            maxLength={5}
            value={version || ""}
            onChange={(event) => {
              setVersion(event.target.value);
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
            placeholder="A description what the skos file represents."
            value={description || ""}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            style={{ height: "20rem" }}
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
            onBlur={handleUrlBlur}
            pattern="https://.*"
            size="30"
            placeholder="https://example.com"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default MappingPredicates;
