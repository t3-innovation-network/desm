import { flatMap, intersection, uniq } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import { alignmentSortOptions, spineSortOptions } from '../SortOptions';
import { action, thunk } from 'easy-peasy';
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

  // data
  // The list of available domains
  domains: [],
  // The available list of organizations
  organizations: [],
  //  The complete list of available predicates
  predicates: [],
  // The value from the input in the searchbar, to filter properties
  propertiesInputValue: '',
};

export const propertyClassesForSpineTerm = (term) => {
  const selectedDomains = uniq(
    flatMap(term.alignments, (alignment) => alignment.selectedDomains || [])
  );
  const termClasses = term.property.domain || [];
  return intersection(selectedDomains, termClasses);
};

export const propertyClassesForAlignmentTerm = (alignment, term) => {
  const selectedDomains = alignment.selectedDomains || [];
  const termClasses = term.property.domain || [];
  return intersection(selectedDomains, termClasses);
};

export const propertyMappingListStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed

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

  // thunks
  // Use the service to get all the available domains
  handleFetchDomains: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();
    const response = await fetchDomains();
    if (state.withoutErrors(response)) {
      actions.setDomains(response.domains);
      actions.setSelectedDomain(response.domains[0]);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Use the service to get all the available organizations
  handleFetchOrganizations: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();
    const response = await fetchOrganizations();
    if (state.withoutErrors(response)) {
      actions.setAllOrganizations(response.organizations);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Use the service to get all the available predicates
  handleFetchPredicates: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();
    const response = await fetchPredicates();
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
    await Promise.all([
      actions.handleFetchDomains(),
      actions.handleFetchOrganizations(),
      actions.handleFetchPredicates(),
    ]);
    if (!h.getState().hasErrors) actions.setLoading(false);
  }),
});
