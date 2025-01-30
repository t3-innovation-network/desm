import { action, computed, thunk } from 'easy-peasy';
import { pull } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import fetchAgents from '../../../services/fetchAgents';
import fetchAgentsFilters from '../../../services/fetchAgentsFilters';

export const defaultState = {
  // status
  showFilters: false,

  // options
  searchInput: '',
  selectedConfigurationProfiles: [],
  selectedConfigurationProfileStates: [],
  selectedOrganizations: [],

  // data
  agents: [],
  configurationProfiles: [],
  configurationProfileStates: [],
  organizations: [],
};

const updatedFilterFor = (items, id) => {
  items.includes(id) ? pull(items, id) : items.push(id);
};

export const agentsStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  filterParams: computed((state) => {
    return {
      search: state.searchInput,
      configurationProfileIds: state.selectedConfigurationProfiles,
      configurationProfileStates: state.selectedConfigurationProfileStates,
      organizationIds: state.selectedOrganizations,
    };
  }),

  // actions
  // set filters
  setFilters: action((state, filters) => {
    state.organizations = filters.organizations;
    state.configurationProfiles = filters.configurationProfiles;
    state.configurationProfileStates = filters.states;
  }),
  toggleFilters: action((state) => {
    state.showFilters = !state.showFilters;
  }),
  updateSelectedOrganization: action((state, id) => {
    updatedFilterFor(state.selectedOrganizations, parseInt(id));
  }),
  updateSelectedProfile: action((state, id) => {
    updatedFilterFor(state.selectedConfigurationProfiles, parseInt(id));
  }),
  updateSelectedState: action((state, id) => {
    updatedFilterFor(state.selectedConfigurationProfileStates, id);
  }),

  // thunks
  // fetch filters
  handleFetchFilters: thunk(async (actions, _, h) => {
    const state = h.getState();
    let response = await fetchAgentsFilters();
    if (state.withoutErrors(response)) {
      actions.setFilters(response.filters);
    } else {
      actions.addError(response.error);
    }
  }),
  // fetch agents
  handleFetchAgents: thunk(async (actions, params = {}, h) => {
    const state = h.getState();
    let response = await fetchAgents(params);
    if (state.withoutErrors(response)) {
      actions.setAgents(response.agents);
    } else {
      actions.addError(response.error);
    }
  }),
  // fetch initial data
  fetchDataFromAPI: thunk(async (actions, _) => {
    // Get the mapping
    await Promise.all([actions.handleFetchAgents(), actions.handleFetchFilters()]);
  }),
});
