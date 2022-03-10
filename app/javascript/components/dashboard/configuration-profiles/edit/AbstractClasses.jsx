import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import updateCP from "../../../../services/updateCP";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import { validURL } from "../../../../helpers/URL";
import fetchSkosFile from "../../../../services/fetchSkosFile";
import Loader from "../../../shared/Loader";
import { useEffect } from "react";
import fetchCPSkosLabels from "../../../../services/fetchCpSkosLabels";

const AbstractClasses = () => {
  const configurationProfile = useSelector((state) => state.currentCP);
  const [filename, setFilename] = useState(
    configurationProfile.structure.abstractClasses?.name || ""
  );
  const [version, setVersion] = useState(
    configurationProfile.structure.abstractClasses?.version || ""
  );
  const [description, setDescription] = useState(
    configurationProfile.structure.abstractClasses?.description || ""
  );
  const [origin, setOrigin] = useState(
    configurationProfile.structure.abstractClasses?.origin || ""
  );
  const [jsonAbstractClasses, setJsonAbstractClasses] = useState(
    configurationProfile.jsonAbstractClasses
  );
  const [loading, setLoading] = useState(false);
  const [urlEditable, setUrlEditable] = useState(!origin);
  const [abstractClassesLabels, setAbstractClassesLabels] = useState([]);

  const dispatch = useDispatch();

  const buildCpData = () => {
    let localCP = configurationProfile;
    localCP.jsonAbstractClasses = jsonAbstractClasses;
    localCP.structure.abstractClasses = {
      name: filename,
      version: version,
      description: description,
      origin: origin,
    };

    return localCP;
  };

  const handleFetchUrl = () => {
    if (!validURL(origin)) {
      dispatch(
        setEditCPErrors("The abstract classes origin must be a valid URL")
      );
      return;
    }
    dispatch(setEditCPErrors(null));
    handleBlur();
    handleFetchSkosFile();
  };

  const handleFetchSkosFile = () => {
    setLoading(true);
    fetchSkosFile(origin).then((response) => {
      if (response.error || !response.valid) {
        let message = response.error || "Invalid Skos File";
        dispatch(setEditCPErrors(message));
        setLoading(false);
        setOrigin(null);
        return;
      }

      setJsonAbstractClasses(response.skosFile);
      setUrlEditable(false);
      setLoading(false);
    });
  };

  const handleFetchAbstractClassesLabels = () => {
    fetchCPSkosLabels(configurationProfile.id, "json_abstract_classes").then(
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

  const handleBlur = () => {
    dispatch(setSavingCP(true));

    updateCP(configurationProfile.id, buildCpData()).then((response) => {
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
    if (jsonAbstractClasses) handleBlur();
  }, [jsonAbstractClasses]);

  useEffect(() => {
    if (configurationProfile.jsonAbstractClasses) {
      handleFetchAbstractClassesLabels();
    }
  }, [configurationProfile.jsonAbstractClasses]);

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
            placeholder="The name of the skos file."
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
            style={{ height: "10rem" }}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="mt-5">
        <label>Origin (URL)</label>
        {urlEditable ? (
          <div className="input-group input-group">
            <input
              type="url"
              className="form-control input-lg"
              name="origin"
              value={origin}
              onChange={(event) => {
                setOrigin(event.target.value);
              }}
              pattern="https://.*"
              size="30"
              placeholder="https://example.com"
              required
            />
            <button
              className="btn btn-dark ml-2"
              onClick={handleFetchUrl}
              disabled={!origin}
              data-toggle="tooltip"
              data-placement="bottom"
              title={"Fetch the concepts"}
            >
              {loading ? (
                <Loader noPadding={true} smallSpinner={true} />
              ) : (
                "Fetch"
              )}
            </button>
          </div>
        ) : (
          <div className="input-group input-group">
            <label>{origin}</label>
            <button
              className="btn btn-dark ml-auto"
              onClick={() => {
                setUrlEditable(true);
              }}
              data-toggle="tooltip"
              data-placement="bottom"
              title={"Edit the origin Url"}
            >
              Edit
            </button>
          </div>
        )}
        <small className="col-on-primary-light font-italic">
          Please be sure the content is in one of the following formats: CSV,
          JSON, JSONLD, RDF or XML
        </small>
      </div>

      {abstractClassesLabels.length > 0 && (
        <div>
          <ul className="form-group">
            {abstractClassesLabels.map((concept) => {
              return <li key={concept["uri"]}>{concept["label"]}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AbstractClasses;
