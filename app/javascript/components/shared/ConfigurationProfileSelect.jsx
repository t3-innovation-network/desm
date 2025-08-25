import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Form from 'react-bootstrap/Form';
import AlertNotice from './AlertNotice';
import fetchConfigurationProfiles from '../../services/fetchConfigurationProfiles';
import setConfigurationProfile from '../../services/setConfigurationProfile';
import { i18n } from '../../utils/i18n';

const ConfigurationProfileSelect = ({
  onChange,
  onSubmit,
  requestType,
  children,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const configurationProfile = configurationProfiles.find(
      (p) => p.id.toString() === e.target.value
    );
    if (!configurationProfile) return;

    setSelectedConfigurationProfile(configurationProfile);
    // if onSubmit is passed, call it and return, usually it's passed when we don't want to change the current configuration profile
    // globally but just want to use it for a specific action
    if (onSubmit) {
      onSubmit(configurationProfile);
      return;
    }
    setSubmitting(true);
    await setConfigurationProfile(configurationProfile.id);
    setCurrentConfigurationProfile(configurationProfile);
    setLeadMapper(configurationProfile.leadMapper);
    setOrganization(configurationProfile.organization);
    setSubmitting(false);
    onChange?.();
  };

  const placeholderOptionText = loading
    ? 'Loading…'
    : configurationProfiles.length
      ? i18n.t('ui.select.configuration_profile.placeholder')
      : 'No data';

  const submitDisabled = !configurationProfiles.length || submitting;

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
    <div className="row mb-3">
      <div className="col-12 col-md-6 col-lg-4">
        <Form.Select
          aria-label={i18n.t('ui.select.configuration_profile.aria_label')}
          disabled={loading || submitDisabled}
          value={selectedConfigurationProfile?.id}
          id="currentConfigurationProfile"
          size="lg"
          onChange={handleSubmit}
        >
          <option value="">{placeholderOptionText}</option>
          {configurationProfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Form.Select>
      </div>
      {children}
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
