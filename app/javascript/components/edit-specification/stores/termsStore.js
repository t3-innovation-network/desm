import { action, computed, thunk } from 'easy-peasy';
import { remove } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import fetchSpine from '../../../services/fetchSpine';
import fetchSpineTerms from '../../../services/fetchSpineTerms';
import fetchMapping from '../../../services/fetchMapping';
import fetchMappingSelectedTerms from '../../../services/fetchMappingSelectedTerms';
import { filterTerms } from '../../align-and-fine-tune/stores/mappingStore';

export const TERMS_MODE = {
  SPINE: 'spine',
  MAPPING: 'mapping',
};

export const defaultState = {
  // status
  // Whether we are editing a term or not. Useful to show/hide the modal window to edit a term
  editingTerm: false,

  // options
  mode: TERMS_MODE.SPINE, // 'spine' or 'mapping'

  // data
  // parent item - mapping or spine domain
  parentItem: {},
  // The specification terms list
  terms: [],
  // The term to be edited. Active when the user clicks the pencil icon on a term
  termToEdit: { property: {} },
  // The value of the input that the user is typing in the search box to filter the list of terms
  termsInputValue: '',
};

export const termsStore = (initialData = {}) => ({
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
  onUpdateTerm: action((state, updatedTerm) => {
    let idx = state.terms.findIndex((t) => t.id === updatedTerm.id);
    if (idx >= 0) state.terms[idx] = updatedTerm;
  }),
  onRemoveTerm: action((state, term) => {
    remove(state.terms, (t) => t.id === term.id);
  }),

  // thunks
  // Get the specification
  handleFetchSpine: thunk(async (actions, { parentId }, h) => {
    const state = h.getState();
    const response = await fetchSpine(parentId);
    if (state.withoutErrors(response)) {
      actions.setParentItem(response.spine.domain);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Get the specification terms
  handleFetchSpineTerms: thunk(async (actions, { parentId }, h) => {
    const state = h.getState();
    const response = await fetchSpineTerms(parentId);
    if (state.withoutErrors(response)) {
      actions.setTerms(response.terms);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Get the mapping
  handleFetchMapping: thunk(async (actions, { parentId }, h) => {
    const state = h.getState();
    let response = await fetchMapping(parentId);
    if (state.withoutErrors(response)) {
      actions.setParentItem(response.mapping);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Get the mapping terms
  handleFetchMappingTerms: thunk(async (actions, { parentId }, h) => {
    const state = h.getState();
    const response = await fetchMappingSelectedTerms(parentId);
    if (state.withoutErrors(response)) {
      actions.setTerms(response.terms);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Fetch initial data
  fetchDataFromAPI: thunk(async (actions, { parentId }, h) => {
    if (h.getState().mode === TERMS_MODE.SPINE) {
      await Promise.all([
        actions.handleFetchSpine({ parentId }),
        actions.handleFetchSpineTerms({ parentId }),
      ]);
    } else {
      await Promise.all([
        actions.handleFetchMapping({ parentId }),
        actions.handleFetchMappingTerms({ parentId }),
      ]);
    }
    if (!h.getState().hasErrors) actions.setLoading(false);
  }),
});
