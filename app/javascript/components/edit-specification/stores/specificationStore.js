import { action, computed, thunk } from 'easy-peasy';
import { remove } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import fetchSpine from '../../../services/fetchSpine';
import fetchSpineTerms from '../../../services/fetchSpineTerms';
import { filterTerms } from '../../align-and-fine-tune/stores/mappingStore';

export const defaultState = {
  // status
  // Whether we are editing a term or not. Useful to show/hide the modal window to edit a term
  editingTerm: false,

  // data
  // Domain
  domain: {},
  // The specification terms list
  terms: [],
  // The term to be edited. Active when the user clicks the pencil icon on a term
  termToEdit: { property: {} },
  // The value of the input that the user is typing in the search box to filter the list of terms
  termsInputValue: '',
};

export const specificationStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  filteredTerms: computed((state) => filterTerms(state.terms, state.termsInputValue)),

  // actions
  // Handles to view the modal window that allows to edit a term
  onEditTermClick: action((state, term) => {
    state.editingTerm = true;
    state.termToEdit = term;
  }),
  onRemoveTerm: action((state, term) => {
    remove(state.terms, (t) => t.id === term.id);
  }),

  // thunks
  // Get the specification
  handleFetchSpine: thunk(async (actions, { spineId }, h) => {
    const state = h.getState();
    const response = await fetchSpine(spineId);
    if (state.withoutErrors(response)) {
      actions.setDomain(response.spine.domain);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Get the specification terms
  handleFetchSpineTerms: thunk(async (actions, { spineId }, h) => {
    const state = h.getState();
    const response = await fetchSpineTerms(spineId);
    if (state.withoutErrors(response)) {
      actions.setTerms(response.terms);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Fetch initial data
  fetchDataFromAPI: thunk(async (actions, { spineId }, h) => {
    // Get the specification
    await actions.handleFetchSpine({ spineId });
    // Get the terms
    await actions.handleFetchSpineTerms({ spineId });
    if (!h.getState().hasErrors) actions.setLoading(false);
  }),
});
