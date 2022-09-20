import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import fetchConfigurationProfiles from "../../services/fetchConfigurationProfiles";
import setCurrentConfigurationProfile from "../../services/setCurrentConfigurationProfile";
import Loader from "../shared/Loader";

const ConfigurationProfileSelect = ({ onChange }) => {
  const {
    currentConfigurationProfileId,
    setCurrentConfigurationProfileId
  } = useContext(AppContext);

  const [configurationProfiles, setConfigurationProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [
    selectedConfigurationProfileId,
    setSelectedConfigurationProfileId
  ] = useState(currentConfigurationProfileId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await setCurrentConfigurationProfile(selectedConfigurationProfileId);
    setCurrentConfigurationProfileId(selectedConfigurationProfileId);
    setSubmitting(false);
    onChange?.();
  };

  const placeholderOptionText = (
    loading ? "Loading…" : (configurationProfiles.length ? "Choose…" : "No data")
  );

  const submitDisabled = (
    !configurationProfiles.length ||
      !selectedConfigurationProfileId ||
      submitting
  );

  useEffect(() => {
    (async () => {
      const { configurationProfiles } = await fetchConfigurationProfiles();
      setConfigurationProfiles(configurationProfiles);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="card mb-3">
      <div className="card-header">
        Choose Configuration Profile
      </div>
      <div className="card-body">
        <form className="form-inline" onSubmit={handleSubmit}>
          <label className="mr-2" htmlFor="currentConfigurationProfile">
            Current configuration profile:
          </label>
          <select
            className="form-control mr-2"
            disabled={loading || submitting}
            id="currentConfigurationProfile"
            onChange={e => setSelectedConfigurationProfileId(e.target.value)}
            value={selectedConfigurationProfileId}
          >
            <option value="">{placeholderOptionText}</option>
            {configurationProfiles.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            disabled={submitDisabled}
          >
            {loading ? <Loader noPadding smallSpinner /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationProfileSelect;
