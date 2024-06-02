import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import AlertNotice from './AlertNotice';
import fetchConfigurationProfiles from '../../services/fetchConfigurationProfiles';
import setConfigurationProfile from '../../services/setConfigurationProfile';
import Loader from '../shared/Loader';
import { i18n } from 'utils/i18n';

const ConfigurationProfileSelect = ({
  onChange,
  onSubmit,
  requestType,
  // selected configuration profile id
  selectedConfigurationProfileId = null,
  // flag to set or don't set the current configuration profile if no selectedConfigurationProfileId is passed
  // in use at shared mappings page
  withoutUserConfigurationProfile = false,
}) => {
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
    selectedConfigurationProfileId || withoutUserConfigurationProfile
      ? null
      : currentConfigurationProfile
  );

  const handleChange = (e) => {
    const configurationProfile = configurationProfiles.find(
      (p) => p.id.toString() === e.target.value
    );

    setSelectedConfigurationProfile(configurationProfile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if onSubmit is passed, call it and return, usually it's passed when we don't want to change the current configuration profile
    // globally but just want to use it for a specific action
    if (onSubmit) {
      onSubmit(selectedConfigurationProfile);
      return;
    }
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
      const { configurationProfiles } = await fetchConfigurationProfiles(requestType);
      setConfigurationProfiles(configurationProfiles);
      if (configurationProfiles.length && selectedConfigurationProfileId && onSubmit) {
        const selectedConfigurationProfile = configurationProfiles.find(
          (p) => p.id === selectedConfigurationProfileId
        );
        setSelectedConfigurationProfile(selectedConfigurationProfile);
        onSubmit(selectedConfigurationProfile);
      }
      setLoading(false);
    })();
  }, []);

  return configurationProfiles.length || loading ? (
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
  ) : (
    <div className="w-100">
      <AlertNotice
        withTitle={false}
        message={i18n.t('ui.view_mapping.no_mappings.all')}
        cssClass="alert-warning"
      />
    </div>
  );
};

export default ConfigurationProfileSelect;
