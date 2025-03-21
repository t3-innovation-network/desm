import { useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import { Link } from 'react-router-dom';
import useDebounce from '../../../helpers/useDebounce';
import { agentsStore } from '../stores/agentsStore';
import useDidMountEffect from '../../../helpers/useDidMountEffect';
import AgentsFilters from './AgentsFilters';
import SearchBar from './SearchBar';
import DashboardContainer from '../DashboardContainer';
import AlertNotice from '../../../components/shared/AlertNotice';
import { pageRoutes } from '../../../services/pageRoutes';
import { i18n } from '../../../utils/i18n';
import { scrollToElement } from '../../../utils/scrollToElement';

const buildRowId = (id) => `agent_${id}`;

const AgentsIndex = ({ location }) => {
  const store = useLocalStore(() => agentsStore());
  const { hash } = location;
  const [state, actions] = store;
  const { agents } = state;
  const searchInput = useDebounce(state.searchInput);

  // fetch data on start and refetch when searchInput/other filters changes
  useEffect(() => {
    actions.fetchDataFromAPI();
  }, []);

  useEffect(() => {
    if (agents.length) {
      scrollToElement(hash, buildRowId);
    }
  }, [agents, hash]);

  useDidMountEffect(
    () => actions.handleFetchAgents(state.filterParams),
    [
      searchInput,
      state.selectedConfigurationProfiles,
      state.selectedConfigurationProfileStates,
      state.selectedOrganizations,
    ]
  );

  const profileData = (profile) => (
    <li key={profile.configurationProfile.id}>
      <Link key={profile.id} to={pageRoutes.configurationProfile(profile.configurationProfile.id)}>
        {`${profile.configurationProfile.name} (${profile.configurationProfile.state})`}
      </Link>
    </li>
  );
  const organizationData = (profile) =>
    `${profile.organization.name}${profile.leadMapper ? ' (Lead Mapper)' : ''}`;
  const buildTableRow = (agent) => {
    const profiles = agent.profiles.map(profileData);
    const dsos = agent.profiles.map(organizationData);
    return (
      <tr id={buildRowId(agent.id)} key={agent.id}>
        <td>{agent.name}</td>
        <td>{agent.email}</td>
        <td>{agent.phone}</td>
        <td className="white-space-pre-line">{dsos.join('\n')}</td>
        <td className="white-space-pre-line">
          <ul className="list-unstyled">{profiles}</ul>
        </td>
        <td>
          <a href={`/agents/${agent.id}/impersonate`}>Impersonate</a>
        </td>
      </tr>
    );
  };

  return (
    <DashboardContainer>
      <div className="col mt-5">
        <h1>{i18n.t('ui.dashboard.nav.agents')}</h1>
        <SearchBar search={state.searchInput} updateSearch={actions.setSearchInput} />
        <AgentsFilters store={store} />
        {state.hasErrors ? (
          <AlertNotice message={state.errors} onClose={actions.clearErrors} />
        ) : null}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{i18n.t('ui.dashboard.agents.table.name')}</th>
                <th scope="col">{i18n.t('ui.dashboard.agents.table.email')}</th>
                <th scope="col">{i18n.t('ui.dashboard.agents.table.phone')}</th>
                <th scope="col">{i18n.t('ui.dashboard.agents.table.organization')}</th>
                <th scope="col">{i18n.t('ui.dashboard.agents.table.configuration_profile')}</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>{agents.map(buildTableRow)}</tbody>
          </table>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default AgentsIndex;
