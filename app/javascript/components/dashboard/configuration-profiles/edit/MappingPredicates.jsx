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
  const [jsonMappingPredicates, setJsonMappingPredicates] = useState(
    configurationProfile.jsonMappingPredicates
  );
  const [predicateStrongestMatch, setPredicateStrongestMatch] = useState(
    configurationProfile.predicateStrongestMatch
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [urlEditable, setUrlEditable] = useState(!origin);

  const [predicateLabels, setPredicateLabels] = useState([]);

  const buildCpData = () => {
    let localCP = configurationProfile;
    localCP.jsonMappingPredicates = jsonMappingPredicates;
    localCP.predicateStrongestMatch = predicateStrongestMatch;
    localCP.structure.mappingPredicates = {
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
        setEditCPErrors("The mapping predicates origin must be a valid URL")
      );
      return;
    }
    dispatch(setEditCPErrors(null));
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

      setJsonMappingPredicates(response.skosFile);
      setUrlEditable(false);
      setLoading(false);
    });
  };

  const handleFetchPredicateLabels = () => {
    fetchCPSkosLabels(configurationProfile.id, "json_mapping_predicates").then(
      (response) => {
        if (response.error) {
          let message = response.error;
          dispatch(setEditCPErrors(message));
          return;
        }

        setPredicateLabels(response.conceptNames);
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
    if (jsonMappingPredicates) handleBlur();
  }, [jsonMappingPredicates]);

  useEffect(() => {
    if (predicateStrongestMatch) handleBlur();
  }, [predicateStrongestMatch]);

  useEffect(() => {
    if (configurationProfile.jsonMappingPredicates) {
      handleFetchPredicateLabels();
    }
  }, [configurationProfile.jsonMappingPredicates]);

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
      </div>

      {predicateLabels.length > 0 && (
        <div>
          <p className="mt-5 font-weight-bold">
            👇 Please, select the strongest match
          </p>
          <div
            className="form-group"
            defaultValue={configurationProfile.predicateStrongestMatch}
            onChange={(e) => {
              setPredicateStrongestMatch(e.target.value);
            }}
          >
            {predicateLabels.map((concept) => {
              return (
                <div key={concept["uri"]}>
                  <input
                    type="radio"
                    value={concept["uri"]}
                    name="predicate"
                    id={`predicate-${concept["uri"]}`}
                    required={true}
                    defaultChecked={concept["uri"] === predicateStrongestMatch}
                  />
                  <label
                    className="ml-2 cursor-pointer"
                    htmlFor={`predicate-${concept["uri"]}`}
                  >
                    {concept["label"]}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingPredicates;
