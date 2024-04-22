import { action, computed, thunk } from 'easy-peasy';
import { remove } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import deleteMappingSelectedTerm from '../../../services/deleteMappingSelectedTerm';
import fetchMapping from '../../../services/fetchMapping';
import fetchSpecification from '../../../services/fetchSpecification';
import fetchSpecificationTerms from '../../../services/fetchSpecificationTerms';
import updateMapping from '../../../services/updateMapping';
import updateMappingSelectedTerms from '../../../services/updateMappingSelectedTerms';
import { filterTerms } from '../../align-and-fine-tune/stores/mappingStore';
import { showSuccess } from '../../../helpers/Messages';

export const defaultState = {
  // status
  // Whether we are editing a term or not. Useful to show/hide the modal window to edit a term
  editingTerm: false,
  // Whether any change awas performed after the page loads
  changesPerformed: 0,
  // Whether we are saving changes to the mapping
  savingChanges: false,

  // options
  // Whether to hide mapped terms or not
  hideMapped: false,

  // data
  // Domain
  domain: {},
  // Declare and have an initial state for the mapping
  mapping: {},
  // The specification terms list
  terms: [],
  // The term to be edited. Active when the user clicks the pencil icon on a term
  termToEdit: { property: {} },
  // The value of the input that the user is typing in the search box to filter the list of terms
  termsInputValue: '',
};

export const mappingToDomainsStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  filteredSelectedTerms: computed((state) =>
    filterTerms(state.terms, state.termsInputValue, {
      pickSelected: true,
    })
  ),
  filteredNotSelectedTerms: computed((state) =>
    filterTerms(state.terms, state.termsInputValue, {
      pickSelected: false,
    })
  ),
  // Mapped terms
  mappedTerms: computed((state) => state.terms.filter((t) => t.mapped)),
  // The selected terms.
  selectedTerms: computed((state) => state.terms.filter((t) => t.selected)),

  // actions
  afterDropTerm: action((state, { items }) => {
    // Mark the terms as not selected and mapped
    state.terms.forEach((term) => {
      if (items.some((item) => item.id === term.id)) {
        term.mapped = true;
        term.selected = false;
      }
    });
    // Count the amont of changes
    state.changesPerformed += items.length;
  }),
  // Click on a term
  onTermClick: action((state, clickedTerm) => {
    if (!clickedTerm.mapped) {
      let term = state.terms.find((t) => t.id == clickedTerm.id);
      term.selected = clickedTerm.selected;
    }
  }),
  // Handles to view the modal window that allows to edit a term
  onEditTermClick: action((state, term) => {
    state.editingTerm = true;
    state.termToEdit = term;
  }),
  onRemoveTerm: action((state, term) => {
    remove(state.terms, (t) => t.id === term.id);
  }),
  revertTerm: action((state, { termId, withChanges = false }) => {
    let term = state.terms.find((t) => t.id == termId);
    term.mapped = false;
    term.mappedPersistent = false;
    if (withChanges) state.changesPerformed--;
  }),
  setAndMapTerms: action((state, terms) => {
    const termIds = state.mapping.selected_terms.map((t) => t.id);
    state.terms = terms.map((t) => {
      t.mapped = termIds.includes(t.id);
      // We need to keep the original state of the term, so we can compare it
      t.mappedPersistent = t.mapped;
      return t;
    });
  }),
  setTermsMappingPersistent: action((state) => {
    state.terms.map((t) => (t.mappedPersistent = true));
  }),
  toggleSelectAll: action((state, { selected }) => {
    state.terms.forEach((term) => (term.selected = selected));
  }),

  // thunks
  // Domain mappping complete. Confirm to save status in the backend
  handleDoneDomainMapping: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();
    const result = await actions.handleSaveChanges({ partiallySave: false });
    if (result) {
      // Change the mapping satus to "in_progress" (with underscore, because it's
      // the name in the backend), so we say it's begun terms mapping phase
      let response = await updateMapping({
        id: state.mapping.id,
        status: 'in_progress',
      });
      if (!state.withoutErrors(response)) {
        actions.setError(response.error);
        return false;
      }
    }
    return result;
  }),
  // Mark the term as "selectable" again. Remove it from the "mapped terms" if it was persistent mapping
  handleRevertMapping: thunk(async (actions, { termId }, h) => {
    const state = h.getState();
    let term = state.terms.find((t) => t.id == termId);

    // Revert the mapping without interact with the API.
    if (!term.mappedPersistent && term.mapped) {
      actions.revertTerm({ termId, withChanges: true });
      return;
    }

    // Update through the api service
    let response = await deleteMappingSelectedTerm({
      mappingId: state.mapping.id,
      termId: termId,
    });

    if (state.withoutErrors(response)) {
      actions.revertTerm({ termId });
      showSuccess('Changes saved!');
    } else {
      actions.setError(response.error);
      return false;
    }
  }),
  // Save the changes
  handleSaveChanges: thunk(async (actions, params = { partiallySave: true }, h) => {
    const state = h.getState();
    actions.setSavingChanges(true);
    const response = await updateMappingSelectedTerms({
      mappingId: state.mapping.id,
      termIds: state.mappedTerms.map((t) => t.id),
    });
    actions.setSavingChanges(false);

    if (state.withoutErrors(response)) {
      actions.setChangesPerformed(0);
      actions.setTermsMappingPersistent();
      if (params.partiallySave) showSuccess('Changes saved!');
    } else {
      actions.setError(response.error);
      return false;
    }
    return true;
  }),
  // Get the mapping
  handleFetchMapping: thunk(async (actions, { mappingId }, h) => {
    const state = h.getState();
    const response = await fetchMapping(mappingId);
    if (state.withoutErrors(response)) {
      actions.setMapping(response.mapping);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Get the specification
  handleFetchSpecification: thunk(async (actions, { specificationId }, h) => {
    const state = h.getState();
    const response = await fetchSpecification(specificationId);
    if (state.withoutErrors(response)) {
      actions.setDomain(response.specification.domain);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Get the specification terms
  handleFetchSpecificationTerms: thunk(async (actions, { specificationId }, h) => {
    const state = h.getState();
    const response = await fetchSpecificationTerms(specificationId);
    if (state.withoutErrors(response)) {
      actions.setAndMapTerms(response.terms);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  // Fetch initial data
  fetchDataFromAPI: thunk(async (actions, { mappingId }, h) => {
    // Get the mapping
    const response = await actions.handleFetchMapping({ mappingId });
    if (response.mapping) {
      // Get the specification
      await actions.handleFetchSpecification({
        specificationId: response.mapping.specification_id,
      });
      // Get the terms
      await actions.handleFetchSpecificationTerms({
        specificationId: response.mapping.specification_id,
      });
    }
    if (!h.getState().hasErrors) actions.setLoading(false);
  }),
});
