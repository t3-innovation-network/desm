import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import { alignmentSortOptions, spineSortOptions } from '../SortOptions';
import { action, computed, thunk } from 'easy-peasy';
import fetchDomains from 'services/fetchDomains';
import fetchOrganizations from 'services/fetchOrganizations';
import fetchPredicates from 'services/fetchPredicates';

export const defaultState = {
  // status
  // Flag to determine whether to show or not the spine terms with no mapped terms
  hideSpineTermsWithNoAlignments: false,

  // options
  // The currently selected organizations to fetch alignments from
  selectedAlignmentOrganizations: [],
  // The currently selected domain
  selectedDomain: null,
  // The organizations to show in the filter
  selectedSpineOrganizations: [],
  // The predicates the user selected to use in filter
  selectedPredicates: [],
  // The order the user wants to see the alignments to the spine terms
  selectedAlignmentOrderOption: alignmentSortOptions.ORGANIZATION,
  // The order the user wants to see the spine terms
  selectedSpineOrderOption: spineSortOptions.OVERALL_ALIGNMENT_SCORE,
  // Values based on url query params (abstractClass - selected domain name, cp - configuration profile id)
  abstractClass: null,
  cp: null,

  // data
  // configuration profile used on this page
  configurationProfile: null,
  // if selected configuration profile is without shared mappings
  withoutSharedMappings: false,
  // The list of available domains
  domains: [],
  // The available list of organizations
  organizations: [],
  //  The complete list of available predicates
  predicates: [],
  // The value from the input in the searchbar, to filter properties
  propertiesInputValue: '',
};

export const propertyClassesForSpineTerm = (term) =>
  (term.property.domain ?? []).filter((u) => !u.startsWith('http'));

export const propertyMappingListStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  selectedConfigurationProfileId: computed((state) => (configurationProfile) => {
    if (state.configurationProfile) return null;
    return state.cp ? parseInt(state.cp) : configurationProfile?.id;
  }),

  // actions
  setAllOrganizations: action((state, organizations) => {
    state.organizations = organizations;
    state.selectedSpineOrganizations = organizations;
    state.selectedAlignmentOrganizations = organizations;
  }),
  setAllPredicates: action((state, predicates) => {
    state.predicates = predicates;
    state.selectedPredicates = predicates;
  }),
  updateSelectedDomain: action((state, selectedDomain) => {
    state.selectedDomain = selectedDomain;
    state.abstractClass = null;
  }),
  updateSelectedConfigurationProfile: action((state, configurationProfile) => {
    state.configurationProfile = configurationProfile;
    if (configurationProfile) {
      state.cp = null;
      state.withoutSharedMappings = false;
    } else {
      state.withoutSharedMappings = true;
    }
  }),

  // thunks
  // Use the service to get all the available domains
  handleFetchDomains: thunk(async (actions, params = {}, h) => {
    const state = h.getState();
    const response = await fetchDomains(params);
    if (state.withoutErrors(response)) {
      actions.setDomains(response.domains);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Use the service to get all the available organizations
  handleFetchOrganizations: thunk(async (actions, params = {}, h) => {
    const state = h.getState();
    const response = await fetchOrganizations(params);
    if (state.withoutErrors(response)) {
      actions.setAllOrganizations(response.organizations);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Use the service to get all the available predicates
  handleFetchPredicates: thunk(async (actions, params = {}, h) => {
    const state = h.getState();
    const response = await fetchPredicates(params);
    if (state.withoutErrors(response)) {
      actions.setAllPredicates(response.predicates);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Fetch all the necessary data from the API
  fetchDataFromAPI: thunk(async (actions, _params = {}, h) => {
    actions.setLoading(true);
    const state = h.getState();
    const queryParams = {
      configurationProfileId: state.configurationProfile?.id,
    };
    await Promise.all([
      actions.handleFetchDomains(queryParams),
      actions.handleFetchOrganizations(queryParams),
      actions.handleFetchPredicates(queryParams),
    ]);
    if (!h.getState().hasErrors) actions.setLoading(false);
  }),
});
