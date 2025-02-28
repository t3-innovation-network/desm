import { flatMap, intersection } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import { alignmentSortOptions, spineSortOptions } from '../SortOptions';
import { action, computed, thunk } from 'easy-peasy';
import fetchDomains from '../../../services/fetchDomains';
import fetchPredicates from '../../../services/fetchPredicates';
import fetchSpecifications from '../../../services/fetchSpecifications';

export const defaultState = {
  // status
  // Flag to determine whether to show or not the spine terms with no mapped terms
  hideSpineTermsWithNoAlignments: false,
  sidebarCollapsed: true,
  // Offcanvas state
  showInfo: false,
  showExport: false,
  showSearch: false,
  showFilters: false,

  // options
  // The currently selected specifications to fetch alignments from
  selectedAlignmentSpecifications: [],
  // The currently selected domain
  selectedDomain: null,
  // The specifications to show in the filter
  selectedSpineSpecifications: [],
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
  // The available list of specifications
  specifications: [],
  //  The complete list of available predicates
  predicates: [],
  // The value from the input in the searchbar, to filter properties
  propertiesInputValue: '',
};

export const propertyClassesForSpineTerm = (term) =>
  intersection(
    term.compactDomains,
    flatMap(term.alignments, (a) => a.compactDomains)
  );

export const propertyClassesForAlignmentTerm = (alignment, term) =>
  intersection(term.compactDomains, alignment.compactDomains);

const ifFilterAppliedFor = (selectedItems, items) => selectedItems.length !== items.length;

export const propertyMappingListStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  isExportEnabled: computed(
    (state) => state.configurationProfile?.withSharedMappings && !state.loading
  ),
  isInfoEnabled: computed(
    (state) =>
      state.configurationProfile?.withSharedMappings && state.selectedDomain && !state.loading
  ),
  isSearchEnabled: computed(
    (state) => state.configurationProfile?.withSharedMappings && !state.loading
  ),
  isFiltersEnabled: computed(
    (state) => state.configurationProfile?.withSharedMappings && !state.loading
  ),
  selectedConfigurationProfileId: computed((state) => (configurationProfile) => {
    if (state.configurationProfile) return null;
    return state.cp ? parseInt(state.cp) : configurationProfile?.id;
  }),
  withSearchInput: computed(
    (state) => state.hideSpineTermsWithNoAlignments || state.propertiesInputValue.length > 0
  ),
  withFilters: computed(
    (state) =>
      ifFilterAppliedFor(state.selectedSpineSpecifications, state.specifications) ||
      ifFilterAppliedFor(state.selectedAlignmentSpecifications, state.specifications) ||
      ifFilterAppliedFor(state.selectedPredicates, state.predicates)
  ),
  // actions
  setAllPredicates: action((state, predicates) => {
    state.predicates = predicates;
    state.selectedPredicates = predicates;
  }),
  setSpecifications: action((state, specifications) => {
    state.specifications = specifications;
    state.selectedSpineSpecifications = specifications;
    state.selectedAlignmentSpecifications = specifications;
  }),
  toggleSidebar: action((state) => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
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
      domain: state.abstractClass,
    };
    await Promise.all([
      actions.handleFetchDomains(queryParams),
      actions.handleFetchPredicates(queryParams),
    ]);
    if (!h.getState().hasErrors) actions.setLoading(false);
  }),
  // Use the service to get all the available specifications
  handleFetchSpecifications: thunk(async (actions, params = {}, h) => {
    actions.setLoading(true);

    const state = h.getState();
    const response = await fetchSpecifications(params);

    if (state.withoutErrors(response)) {
      actions.setSpecifications(response.specifications);
      actions.setLoading(false);
    } else {
      actions.addError(response.error);
    }

    return response;
  }),
});
