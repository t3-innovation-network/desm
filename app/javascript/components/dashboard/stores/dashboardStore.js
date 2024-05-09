import { action, computed, thunk } from 'easy-peasy';
import { sum } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import fetchDashboardStats from 'services/fetchDashboardStats';

export const defaultState = {
  // options
  selectedOptionId: 'all',

  // data
  configurationProfiles: [],
  filterOptions: [],
  mappings: [],
};

export const dashboardStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  activeMappingsCount: computed((state) => state.mappings.inProgress || 0),
  filteredCps: computed((state) => {
    if (state.selectedOptionId === 'all') {
      return state.configurationProfiles;
    }
    return state.configurationProfiles.filter((cp) => cp.state === state.selectedOptionId);
  }),
  dsosCount: computed((state) => sum(state.filteredCps.map((cp) => cp.dsosCount))),
  cpsCount: computed((state) => state.filteredCps.length),
  agentsCount: computed((state) => sum(state.filteredCps.map((cp) => cp.agentsCount))),
  schemesCount: computed((state) => sum(state.filteredCps.map((cp) => cp.associatedSchemasCount))),

  // actions
  setData: action((state, data) => {
    state.mappings = data.stats.mappings;
    state.configurationProfiles = data.stats.configurationProfiles;
    state.filterOptions = data.states;
  }),

  // thunks
  // fetch initial data
  fetchData: thunk(async (actions, _, h) => {
    const state = h.getState();
    let response = await fetchDashboardStats();
    if (state.withoutErrors(response)) {
      actions.setData(response);
    } else {
      actions.addError(response.error);
    }
  }),
});
