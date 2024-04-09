import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import fetchConfigurationProfiles from '../../services/fetchConfigurationProfiles';
import setConfigurationProfile from '../../services/setConfigurationProfile';
import Loader from '../shared/Loader';

const ConfigurationProfileSelect = ({ onChange }) => {
  const {
    currentConfigurationProfile,
    setCurrentConfigurationProfile,
    setLeadMapper,
    setOrganization,
  } = useContext(AppContext);

  const [configurationProfiles, setConfigurationProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedConfigurationProfile, setSelectedConfigurationProfile] = useState(
    currentConfigurationProfile
  );

  const handleChange = (e) => {
    const configurationProfile = configurationProfiles.find(
      (p) => p.id.toString() === e.target.value
    );

    setSelectedConfigurationProfile(configurationProfile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const configurationProfile = configurationProfiles.find(
      (p) => p.id === selectedConfigurationProfile.id
    );

    await setConfigurationProfile(selectedConfigurationProfile.id);
    setCurrentConfigurationProfile(selectedConfigurationProfile);
    setLeadMapper(configurationProfile.leadMapper);
    setOrganization(configurationProfile.organization);
    setSubmitting(false);
    onChange?.();
  };

  const placeholderOptionText = loading
    ? 'Loading…'
    : configurationProfiles.length
    ? 'Choose…'
    : 'No data';

  const submitDisabled =
    !configurationProfiles.length || !selectedConfigurationProfile || submitting;

  useEffect(() => {
    (async () => {
      const { configurationProfiles } = await fetchConfigurationProfiles();
      setConfigurationProfiles(configurationProfiles);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="card mb-3">
      <div className="card-header">Choose Configuration Profile</div>
      <div className="card-body">
        <form className="form-inline" onSubmit={handleSubmit}>
          <label className="mr-2" htmlFor="currentConfigurationProfile">
            Current configuration profile:
          </label>
          <select
            className="form-control mr-2"
            disabled={loading || submitting}
            id="currentConfigurationProfile"
            onChange={handleChange}
            value={selectedConfigurationProfile?.id}
          >
            <option value="">{placeholderOptionText}</option>
            {configurationProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" disabled={submitDisabled}>
            {loading ? <Loader noPadding smallSpinner /> : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationProfileSelect;
