import { action, computed, thunk } from 'easy-peasy';
import { isEmpty, remove, sortBy } from 'lodash';
import { toastr as toast } from 'react-redux-toastr';
import { baseModel, nextId } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import fetchAlignments from '../../../services/fetchAlignments';
import fetchAudits from '../../../services/fetchAudits';
import fetchMapping from '../../../services/fetchMapping';
import fetchMappingSelectedTerms from '../../../services/fetchMappingSelectedTerms';
import fetchPredicates from '../../../services/fetchPredicates';
import fetchSpineTerms from '../../../services/fetchSpineTerms';
import deleteAlignment from '../../../services/deleteAlignment';
import saveAlignments from '../../../services/saveAlignments';
import updateMapping from '../../../services/updateMapping';

export const defaultState = {
  // status
  // Flag to control when the user is adding a synthetic property
  addingSynthetic: false,
  // Controls the amount of changes performed after the page loads
  changesPerformed: 0,
  // Controls displaying the removal confirmation dialog
  confirmingRemoveAlignment: false,

  // options
  // Whether to hide mapped spine terms or not
  hideMappedSelectedTerms: false,
  // Whether to hide mapped mapping terms or not
  hideMappedSpineTerms: false,

  // data
  /**
   * The terms of the mapping (The ones for the output, not visible here, but necessary
   * to configure the relation between the predicate, spine term and selected terms
   * from the specification)
   */
  alignments: [],
  // Represents the alignment that's going to be removed if the user confirms that action
  alignmentToRemove: null,
  // The date the mapping was marked as "mapped", which is "completed".
  dateMapped: null,
  // Declare and have an initial state for the mapping
  mapping: {},
  // The terms of the mapping (The selected ones from the uploaded specification)
  mappingSelectedTerms: [],
  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of mapping terms
   */
  mappingSelectedTermsInputValue: '',
  /**
   * The predicates from DB. These will be used to match a mapping term to a spine
   * term in a meaningful way. E.g. "Identical", "Aggregated", ...
   */
  predicates: [],
  /**
   * The terms of the spine (The specification being mapped against)
   */
  spineTerms: [],
  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of spine terms
   */
  spineTermsInputValue: '',
  scrollTop: 0,
};

export const noMatchPredicate = (predicate) =>
  predicate?.source_uri?.toLowerCase()?.includes('nomatch');

const filterTerms = (terms, inputValue, options = { pickSelected: false }) =>
  terms
    .filter(
      (term) =>
        (options.pickSelected ? term.selected : !term.selected) &&
        term.name.toLowerCase().includes(inputValue.toLowerCase())
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));

export const mappingStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  /**
   * Returns the mapping term that corresponds to a specific term by its id
   * It represents the relation between a spine term, one or more selected
   * terms from the original specification and the predicate
   *
   * @param {Integer} spineTermId
   */
  alignmentForSpineTerm: computed((state) => (spineTermId) =>
    state.alignments.find((alg) => alg.spineTermId === spineTermId)
  ),
  /**
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  filteredMappingSelectedTerms: computed((state) =>
    filterTerms(state.mappingSelectedTerms, state.mappingSelectedTermsInputValue, {
      pickSelected: true,
    })
  ),
  filteredMappingNotSelectedTerms: computed((state) =>
    filterTerms(state.mappingSelectedTerms, state.mappingSelectedTermsInputValue, {
      pickSelected: false,
    })
  ),
  /**
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  filteredSpineTerms: computed((state) =>
    sortBy(
      state.spineTerms.filter((term) =>
        term.name.toLowerCase().includes(state.spineTermsInputValue.toLowerCase())
      ),
      [(t) => (t.createdAt ? 1 : 0), (t) => t.name.toLowerCase()]
    )
  ),
  // Alignments that are ready to be saved
  completeAlignments: computed((state) =>
    state.alignments.filter((a) => {
      return state.noMatchPredicateId === a.predicateId || (a.predicateId && a.mappedTerms.length);
    })
  ),
  noMatchPredicateId: computed(
    (state) => state.predicates.find((p) => noMatchPredicate(p))?.id || -1
  ),
  /**
   * Returns whether all the terms from the specification are already mapped.
   * For a term to be correctly mapped, we ensure to detect the predicate for it.
   */
  noPartiallyMappedTerms: computed((state) => state.partiallyMappedTerms.length === 0),
  partiallyMappedTerms: computed((state) =>
    state.alignments.filter((a) => {
      return !(
        state.noMatchPredicateId === a.predicateId ||
        Boolean(a.mappedTerms.length) == Boolean(a.predicateId)
      );
    })
  ),
  /**
   * The already mapped terms. To use in progress bar.
   * For a term to be mapped, it can be 1 of 2 options:
   *
   * 1. The term is recently dragged to the domain, so it's not in the backend, just
   *    marked in memory as "mapped".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   *
   * @param {Object} spineTerm
   */
  mappedTermsToSpineTerm: computed((state) => (spineTerm) => {
    let alignment = state.alignments.find((alg) => alg.spineTermId === spineTerm.id);
    return alignment ? alignment.mappedTerms : [];
  }),
  /**
   * The selected mapping terms (the terms of the original specification, now
   * selected to map into the spine).
   */
  selectedAlignments: computed((state) =>
    state.mappingSelectedTerms.filter((term) => term.selected)
  ),
  /**
   * Returns whether the term is already mapped to the spine. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   */
  selectedTermIsMapped: computed((state) => (alignment) =>
    state.alignments.some(
      (alg) =>
        alg.predicateId &&
        !(state.noMatchPredicateId === alg.predicateId) &&
        alg.mappedTerms.some((mappedTerm) => mappedTerm.id === alignment.id)
    )
  ),
  /**
   * Returns whether the spine term has any mapping terms mapped to it. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The mapping term is already mapped in the backend (is one of the mapping terms mapped in DB).
   */
  spineTermIsMapped: computed((state) => (spineTerm) => {
    let alg = state.alignments.find((alignment) => alignment.spineTermId === spineTerm.id);
    return (
      alg?.predicateId && (state.noMatchPredicateId === alg.predicateId || alg?.mappedTerms?.length)
    );
  }),

  // sync actions
  /**
   * Adds a synthetic property to the spine. It also handles the alignment object to be created.
   */
  handleAddSynthetic: action((state) => {
    state.loading = true;
    try {
      const strongestMatchPredicate = state.predicates.find((p) => p.strongest_match);
      const syntheticTermId = nextId(state.spineTerms);
      state.spineTerms.push({
        id: syntheticTermId,
        name: '',
        synthetic: true,
        property: {
          comment: 'Synthetic property added to spine',
        },
      });
      state.alignments.push({
        synthetic: true,
        mappedTerms: [],
        spineTermId: syntheticTermId,
        predicateId: strongestMatchPredicate?.id,
        comment: null,
      });
      state.changesPerformed++;
      state.addingSynthetic = true;
    } finally {
      state.loading = false;
    }
  }),
  /**
   * Cancel adding a synthetic term to the spine
   */
  handleCancelSynthetic: action((state) => {
    remove(state.alignments, (al) => al.synthetic);
    remove(state.spineTerms, (st) => st.synthetic);
    state.changesPerformed--;
    state.addingSynthetic = false;
  }),
  // After the user drags a mapping term to the spine, we need to mark it as mapped
  afterDropTerm: action((state, { spineTerm }) => {
    state.loading = true;
    try {
      let alignment = state.alignments.find((alg) => alg.spineTermId === spineTerm.id);
      let selectedTerms = state.mappingSelectedTerms.filter((term) => term.selected);
      // Set the selected terms as mapped for the mapping terms dropped on
      alignment.mappedTerms = selectedTerms;
      alignment.changed = true;

      // Manage synthetic name (valid only when the spine term is synthetic)
      if (selectedTerms.length) {
        let synteticTerm = state.spineTerms.find((sTerm) => sTerm.id === spineTerm.id);
        if (synteticTerm.synthetic) spineTerm.name = selectedTerms[0].name;
      }
      // Deselect terms
      selectedTerms.forEach((term) => (term.selected = false));
      // Warn to save changes
      state.changesPerformed++;
    } finally {
      state.loading = false;
    }
  }),
  /**
   * Get the alignment to its previous state
   */
  handleCancelRemoveAlignment: action((state) => {
    state.alignmentToRemove.predicateId = state.alignmentToRemove.previousPredicateId;
    state.alignmentToRemove.mappedTerms = state.alignmentToRemove.previousMappedTerms;
    state.confirmingRemoveAlignment = false;
  }),
  /**
   * Mark the term not mapped.
   *
   * @param {Object} alignment Also called "alignment", containing the information about the spine term,
   * predicate and mapped terms.
   * @param {Object} mappedTerm The mapped term that's going to be detached from the mapping term
   */
  handleRevertMapping: action((state, { termId, mappedTerm, organization }) => {
    let alignment = state.alignments.find((alg) => alg.spineTermId === termId);
    alignment.changed = true;
    alignment.previousMappedTerms = [...alignment.mappedTerms];
    remove(alignment.mappedTerms, (mTerm) => mTerm.id === mappedTerm.id);

    // If there's no mapped terms after removing the selected one (this was the last mapped
    // term, and we removed it) remove the predicate
    if (isEmpty(alignment.mappedTerms)) {
      alignment.previousPredicateId = alignment.predicateId;
      alignment.predicateId = null;
      // If it's a synthetic alignment, and we added it, let's remove it
      if (
        alignment.synthetic &&
        alignment.origin.toLowerCase() === organization.name.toLowerCase()
      ) {
        state.alignmentToRemove = alignment;
        state.confirmingRemoveAlignment = true;
      }
    }

    state.changesPerformed++;
  }),

  markMappingTermSelected: action((state, mappingTerm) => {
    let term = state.mappingSelectedTerms.find((t) => t.id === mappingTerm.id);
    if (term) term.selected = mappingTerm.selected;
  }),
  /**
   * Manage to change values from mapping term inputs in the state
   *
   * @param {Event} event
   */
  filterMappingSelectedTermsOnChange: action((state, event) => {
    state.mappingSelectedTermsInputValue = event.target.value;
  }),
  /**
   * Manage to change values from spine term inputs in the state
   *
   * @param {Event} event
   */
  filterSpineTermsOnChange: action((state, event) => {
    state.spineTermsInputValue = event.target.value;
  }),
  removeAlignment: action((state) => {
    remove(state.alignments, (mt) => mt.id === state.alignmentToRemove.id);
    remove(state.spineTerms, (sTerm) => sTerm.id === state.alignmentToRemove.spineTermId);
    // Close the modal confirmation window
    state.confirmingRemoveAlignment = false;
    state.alignmentToRemove = null;
    // If this is the only change, it's not right to count it as a change to save, since it's already
    // performed against the service, so it does not represent a change to perform.
    state.changesPerformed--;
  }),
  /**
   * Link the predicate to the corresponding mapping term
   *
   * @param {Object} spineTerm
   * @param {Object} predicate
   */
  selectPredicate: action((state, { spineTerm, predicate }) => {
    let selectedAlignment = state.alignments.find((alg) => alg.spineTermId === spineTerm.id);
    selectedAlignment.predicateId = predicate.id;
    selectedAlignment.changed = true;
    // Warn to save changes
    state.changesPerformed++;
  }),
  updateAlignmentComment: action((state, { id, comment }) => {
    let alignment = state.alignments.find((alg) => alg.id === id);
    alignment.comment = comment;
  }),

  // async actions
  /**
   * Domain mapping complete. Confirm to save status in the backend
   */
  handleDoneAlignment: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();
    const result = await actions.handleSaveAlignments({ partiallySave: false });
    if (result) {
      let response = await updateMapping({
        id: state.mapping.id,
        status: 'mapped',
      });
      if (!state.withoutErrors(response)) {
        actions.setError(response.error);
        return false;
      }
    }
    return result;
  }),

  /**
   * Manages to use the API service to remove an alignment
   */
  handleRemoveAlignment: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();
    if (!state.alignmentToRemove) return;

    let response = await deleteAlignment(state.alignmentToRemove.id);
    if (state.withoutErrors(response)) {
      actions.removeAlignment();
      // Communicate the operation result to the user
      toast.success('Synthetic alignment successfully removed');
    } else {
      actions.addError(response.error);
    }
  }),
  /**
   * Save the performed changes.
   */
  handleSaveAlignments: thunk(async (actions, params = { partiallySave: true }, h) => {
    const state = h.getState();
    actions.setLoading(true);
    const data = state.completeAlignments.map((alignment) => ({
      id: alignment.id,
      predicateId: alignment.predicateId,
      mappedTermIds: alignment.mappedTerms?.map((t) => t.id) ?? [],
    }));

    const response = await saveAlignments(state.mapping.id, data, params);
    actions.setLoading(false);

    if (state.withoutErrors(response)) {
      actions.setChangesPerformed(0);
      if (params.partiallySave) {
        let message = state.noPartiallyMappedTerms
          ? 'Changes saved!'
          : 'Changes saved except highlighted partially mapped terms. Review them with "Hide Mapped Elements" filter on';
        toast.success(message);
      }
    } else {
      actions.setError(response.error);
      return false;
    }
    return true;
  }),

  /**
   * Get the data from the service
   */
  /**
   * Get the mapping
   */
  handleFetchMapping: thunk(async (actions, { mappingId }, h) => {
    const state = h.getState();
    let response = await fetchMapping(mappingId);
    if (state.withoutErrors(response)) {
      actions.setMapping(response.mapping);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),

  /**
   * Get the mapping terms
   */
  handleFetchMappingSelectedTerms: thunk(async (actions, { mappingId }, h) => {
    const state = h.getState();
    let response = await fetchMappingSelectedTerms(mappingId);
    if (state.withoutErrors(response)) {
      actions.setMappingSelectedTerms(response.terms);
    } else {
      actions.addError(response.error);
    }
  }),

  /**
   * Get the mapping terms. These are those that will relate spine terms
   * with predicates and specification selected terms
   */
  handleFetchAlignments: thunk(async (actions, { mappingId }, h) => {
    const state = h.getState();
    let response = await fetchAlignments(mappingId);
    if (state.withoutErrors(response)) {
      let alignmentsList = response.alignments;
      alignmentsList.forEach((alignment) => (alignment.persisted = true));
      actions.setAlignments(alignmentsList);
    } else {
      actions.addError(response.error);
    }
  }),

  /**
   * Get the specification terms
   */
  handleFetchSpineTerms: thunk(async (actions, { spineId }, h) => {
    const state = h.getState();
    let response = await fetchSpineTerms(spineId);
    if (state.withoutErrors(response)) {
      actions.setSpineTerms(response.terms);
    } else {
      actions.addError(response.error);
    }
  }),

  /**
   * Get the specification terms
   */
  handleFetchPredicates: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();
    let response = await fetchPredicates();
    if (state.withoutErrors(response)) {
      actions.setPredicates(response.predicates);
    } else {
      actions.addError(response.error);
    }
  }),

  /**
   * Fetch changes from the api service. This is only used to get the exact date
   * when the mapping changed from "in-progress" to "mapped".
   */
  handleFetchMappingChanges: thunk(async (actions, params = {}, h) => {
    const state = h.getState();
    if (state.mapping.status === 'mapped') {
      let response = await fetchAudits({
        className: 'Mapping',
        instanceIds: state.mapping.id,
        auditAction: 'update',
      });

      if (state.withoutErrors(response)) {
        let statusChangedAudit = response.audits.find(
          (audit) => audit.audited_changes['status'].toString() === '1,2'
        );

        if (statusChangedAudit) {
          actions.setDateMapped(statusChangedAudit.created_at);
        }
      } else {
        actions.addError(response.error);
      }
    }
  }),
  // fetch initial data
  fetchDataFromAPI: thunk(async (actions, { mappingId }) => {
    // Get the mapping
    let response = await actions.handleFetchMapping({ mappingId });
    // Get the mapping terms
    await actions.handleFetchAlignments({ mappingId });
    // Get the mapping selected terms
    await actions.handleFetchMappingSelectedTerms({ mappingId });
    if (response.mapping) {
      // Get the spine terms
      await actions.handleFetchSpineTerms({ spineId: response.mapping.spine_id });
      // Get the audits
      await actions.handleFetchMappingChanges(response.mapping);
    }
    // Get the predicates
    await actions.handleFetchPredicates();
  }),
});
