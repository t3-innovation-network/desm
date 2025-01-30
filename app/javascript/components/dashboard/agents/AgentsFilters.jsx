import HoverableLabel from '../../shared/HoverableLabel';
import ToggleFilters from '../../shared/ToggleFilters';
import { i18n } from '../../../utils/i18n';

const CheckboxFilter = ({ items, selectedItems, updateSelectedItem, setSelectedItems, prefix }) => {
  const htmlId = (id) => `${prefix}-chk-${id}`;

  return (
    <>
      <label
        className="col-primary cursor-pointer non-selectable mb-3"
        onClick={() => setSelectedItems([])}
      >
        {i18n.t('ui.filters.deselect_all')}
      </label>

      {items.map((item) => {
        return (
          <div className="form-check mb-3" key={item.id}>
            <input
              type="checkbox"
              className="form-check-input"
              id={htmlId(item.id)}
              checked={selectedItems.includes(item.id)}
              onChange={(e) => updateSelectedItem(e.target.value)}
              value={item.id}
            />
            <label className="form-check-label cursor-pointer" htmlFor={htmlId(item.id)}>
              {item.name}
            </label>
          </div>
        );
      })}
    </>
  );
};

const AgentsFilters = ({ store }) => {
  const [state, actions] = store;

  const organizationsOptions = () => {
    const { organizations, selectedOrganizations } = state;

    return (
      <CheckboxFilter
        items={organizations}
        selectedItems={selectedOrganizations}
        updateSelectedItem={actions.updateSelectedOrganization}
        setSelectedItems={actions.setSelectedOrganizations}
        prefix="org"
      />
    );
  };

  const configurationProfilesOptions = () => {
    const { configurationProfiles, selectedConfigurationProfiles } = state;

    return (
      <CheckboxFilter
        items={configurationProfiles}
        selectedItems={selectedConfigurationProfiles}
        updateSelectedItem={actions.updateSelectedProfile}
        setSelectedItems={actions.setSelectedConfigurationProfiles}
        prefix="cp"
      />
    );
  };

  const statesOptions = () => {
    const { configurationProfileStates, selectedConfigurationProfileStates } = state;

    return (
      <CheckboxFilter
        items={configurationProfileStates}
        selectedItems={selectedConfigurationProfileStates}
        updateSelectedItem={actions.updateSelectedState}
        setSelectedItems={actions.setSelectedConfigurationProfileStates}
        prefix="st"
      />
    );
  };

  const expandedFilters = () => {
    return (
      <>
        <div className="col-3 mt-3">
          <div className="card borderless">
            <div className="card-header bottom-borderless bg-col-secondary">
              <label className="non-selectable form-label">
                <strong>{i18n.t('ui.dashboard.agents.filters.organization')}</strong>
              </label>
            </div>
            <div className="card-body bg-col-secondary">{organizationsOptions()}</div>
          </div>
        </div>
        <div className="col-3 mt-3">
          <div className="card borderless">
            <div className="card-header bottom-borderless bg-col-secondary">
              <label className="non-selectable form-label">
                <strong>{i18n.t('ui.dashboard.agents.filters.configuration_profile')}</strong>
              </label>
            </div>
            <div className="card-body bg-col-secondary">{configurationProfilesOptions()}</div>
          </div>
        </div>
        <div className="col-3 mt-3">
          <div className="card borderless">
            <div className="card-header bottom-borderless bg-col-secondary">
              <label className="non-selectable form-label">
                <strong>{i18n.t('ui.dashboard.agents.filters.state')}</strong>
              </label>
            </div>
            <div className="card-body bg-col-secondary">{statesOptions()}</div>
          </div>
        </div>
      </>
    );
  };

  const shrinkedFilters = () => {
    return (
      <>
        <div className="col-3 mt-3">
          <HoverableLabel
            label={i18n.t('ui.dashboard.agents.filters.organization')}
            labelCSSClass={'bg-col-secondary'}
            content={organizationsOptions()}
          />
        </div>
        <div className="col-3 mt-3">
          <HoverableLabel
            label={i18n.t('ui.dashboard.agents.filters.configuration_profile')}
            labelCSSClass={'bg-col-secondary'}
            content={configurationProfilesOptions()}
          />
        </div>
        <div className="col-3 mt-3">
          <HoverableLabel
            label={i18n.t('ui.dashboard.agents.filters.state')}
            labelCSSClass={'bg-col-secondary'}
            content={statesOptions()}
          />
        </div>
      </>
    );
  };

  return (
    <div className="row top-border-strong bg-col-secondary">
      <div className="col mt-3">
        <ToggleFilters showFilters={state.showFilters} toggleFilters={actions.toggleFilters} />
      </div>
      {state.showFilters ? expandedFilters() : shrinkedFilters()}
    </div>
  );
};

export default AgentsFilters;
