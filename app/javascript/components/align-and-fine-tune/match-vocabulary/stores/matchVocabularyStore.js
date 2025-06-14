import { action, computed, thunk } from 'easy-peasy';
import { flatMap, maxBy } from 'lodash';
import { baseModel } from '../../../stores/baseModel';
import { easyStateSetters } from '../../../stores/easyState';
import fetchAlignmentVocabulary from '../../../../services/fetchAlignmentVocabulary';
import fetchVocabularyPredicates from '../../../../services/fetchVocabularyPredicates';
import fetchVocabulariesConcepts from '../../../../services/fetchVocabulariesConcepts';
import updateAlignmentVocabularyConcept from '../../../../services/updateAlignmentVocabularyConcept';
import createSyntheticVocabularyConcept from '../../../../services/createSyntheticVocabularyConcept';
import createSpineTermVocabularies from '../../../../services/createSpineTermVocabularies';

export const defaultState = {
  // status
  /**
   * Whether any change was performed after the page loads
   */
  changesPerformed: 0,
  // options
  // data
  // special vocabulary predicates
  predicates: [],
  /**
   * The vocabulary concepts for the spine term
   */
  spineConcepts: [],
  /**
   * The vocabulary concepts for the mapped term
   */
  mappingConcepts: [],
  /**
   * The vocabulary concepts for the mapped term
   */
  alignmentConcepts: [],
};

const flatConcepts = (response) => flatMap(response, (data) => data.concepts);

export const matchVocabularyStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  changedAlignments: computed((state) =>
    state.alignmentConcepts.filter((alignment) => alignment.updated)
  ),
  filteredMappingConcepts: computed(
    (state) =>
      (options = { pickSelected: false }) =>
        state.mappingConcepts
          .filter((concept) => (options.pickSelected ? concept.selected : !concept.selected))
          .sort((a, b) => (a.name > b.name ? 1 : -1))
  ),

  // actions
  toggleMappingConcept: action((state, clickedConcept) => {
    let idx = state.mappingConcepts.findIndex((c) => c.id === clickedConcept.id);
    if (idx >= 0) {
      state.mappingConcepts[idx].selected = !state.mappingConcepts[idx].selected;
    }
  }),
  onPredicateSelected: action((state, { concept, predicate }) => {
    let idx = state.alignmentConcepts.findIndex((c) => c.spineConceptId === concept.id);
    if (idx >= 0) {
      state.alignmentConcepts[idx].predicateId = predicate.id;
      state.alignmentConcepts[idx].updated = true;
      state.changesPerformed++;
    }
  }),
  handleDropOnSynthetic: action((state, alignment) => {
    let idx = state.spineConcepts.findIndex((c) => c.id === alignment.spineConceptId);
    if (idx >= 0) {
      state.spineConcepts[idx].name = alignment.mappedConceptsList[0]?.name;
    }
  }),
  handleAfterDropConcept: action((state, { alignmentIdx, updatedAlignment }) => {
    if (alignmentIdx >= 0) {
      state.alignmentConcepts[alignmentIdx] = updatedAlignment;
    }
    state.mappingConcepts.forEach((concept) => {
      concept.selected = false;
    });
    state.changesPerformed++;
  }),
  addSyntheticConceptRow: action((state, predicates) => {
    const nextSpineConceptId = maxBy(state.spineConcepts, 'id').id + 1;
    state.spineConcepts = [
      {
        id: nextSpineConceptId,
        name: '',
        definition: 'Synthetic concept added to the vocabulary',
        synthetic: true,
      },
      ...state.spineConcepts,
    ];
    const nextAlignmentId = maxBy(state.alignmentConcepts, 'id').id + 1;
    state.alignmentConcepts.push({
      id: nextAlignmentId,
      predicateId: predicates.find((p) => p.strongest_match)?.id,
      spineConceptId: nextSpineConceptId,
      synthetic: true,
    });
  }),

  // thunks
  createSpineTermVocabularies: thunk(async (actions, { spineTerm, mappedTerms }, h) => {
    const state = h.getState();
    const response = await createSpineTermVocabularies({
      spineTermId: spineTerm.id,
      ids: mappedTerms.map((mappedTerm) => mappedTerm.id),
    });
    if (state.withoutErrors(response)) {
      actions.setSpineConcepts(flatConcepts(response));
    } else {
      actions.addError(response.error);
    }
    return response;
  }),
  saveChangedAlignments: thunk(async (actions, _params, h) => {
    const state = h.getState();
    const changedAlignments = state.changedAlignments.filter((a) => a.updated && !a.synthetic);
    for (const alignment of changedAlignments) {
      try {
        const response = await updateAlignmentVocabularyConcept({
          id: alignment.id,
          predicateId: alignment.predicateId,
          mappedConcepts: alignment.mappedConceptsList.map((concept) => concept.id),
        });
        if (!state.withoutErrors(response)) {
          actions.addError(response.error);
          return response;
        }
      } catch (error) {
        actions.addError(error.message);
        return { success: false, error: error.message };
      }
    }
    return { success: true };
  }),
  saveSyntheticAlignments: thunk(async (actions, _params, h) => {
    const state = h.getState();
    const changedAlignments = state.changedAlignments.filter((a) => a.updated && a.synthetic);
    for (const alignment of changedAlignments) {
      try {
        const spineConcept = state.spineConcepts.find((sc) => sc.id === alignment.spineConceptId);
        const response = await createSyntheticVocabularyConcept({
          spine_concept: {
            uri: 'http://desm.org/concepts/concepts/' + spineConcept.name,
            raw: {
              id: 'http://desm.org/concepts/concepts/' + spineConcept.name,
              type: 'skos:Concept',
              prefLabel: {
                'en-us': spineConcept.name,
              },
              definition: {
                'en-us': 'Synthetic concept added to the vocabulary for ' + spineConcept.name,
              },
              inScheme: 'http://desm.org/concepts/mappingClasses',
            },
          },
          alignment: {
            predicate_id: alignment.predicateId,
            alignment_vocabulary_id: state.alignmentConcepts[0]?.alignmentVocabularyId,
            mapped_concepts: alignment.mappedConceptsList.map((mc) => mc.id),
          },
        });
        if (!state.withoutErrors(response)) {
          actions.addError(response.error);
          return response;
        }
      } catch (error) {
        actions.addError(error.message);
        return { success: false, error: error.message };
      }
    }
    return { success: true };
  }),

  handleFetchSpineVocabulary: thunk(async (actions, { spineTerm }, h) => {
    const state = h.getState();
    const vocabIds = spineTerm.vocabularies.map((v) => v.id);
    const response = await fetchVocabulariesConcepts(vocabIds);
    if (state.withoutErrors(response)) {
      actions.setSpineConcepts(flatConcepts(response));
    } else {
      actions.addError(response.error);
    }
    return response;
  }),

  handleFetchMappedTermVocabulary: thunk(async (actions, { mappedTerms }, h) => {
    const state = h.getState();
    const vocabIds = flatMap(mappedTerms, (mappedTerm) => mappedTerm.vocabularies.map((v) => v.id));
    const response = await fetchVocabulariesConcepts(vocabIds);
    if (state.withoutErrors(response)) {
      actions.setMappingConcepts(flatConcepts(response));
    } else {
      actions.addError(response.error);
    }
    return response;
  }),

  handleFetchAlignmentVocabulary: thunk(async (actions, { alignment }, h) => {
    const state = h.getState();
    const response = await fetchAlignmentVocabulary(alignment.id);
    if (state.withoutErrors(response)) {
      actions.setAlignmentConcepts(response.alignmentConcepts);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),

  handleFetchPreducates: thunk(async (actions, _params, h) => {
    const state = h.getState();
    // don't refetch predicates if they are already loaded, they're the same for all vocabularies
    if (state.predicates.length > 0) return;
    const response = await fetchVocabularyPredicates();
    if (state.withoutErrors(response)) {
      actions.setPredicates(response.predicates);
    } else {
      actions.addError(response.error);
    }
    return response;
  }),

  fetchDataFromAPI: thunk(async (actions, { alignment, mappedTerms, spineTerm }, h) => {
    const state = h.getState();
    actions.setLoading(true);
    try {
      let response;
      // if there is no spine vocabularies for the spine term, we create them
      if (spineTerm.vocabularies.length === 0) {
        response = await actions.createSpineTermVocabularies({
          spineTerm,
          mappedTerms,
        });
      } else {
        response = await actions.handleFetchSpineVocabulary({ spineTerm });
      }
      if (state.withoutErrors(response)) {
        await Promise.all([
          actions.handleFetchMappedTermVocabulary({ mappedTerms }),
          actions.handleFetchAlignmentVocabulary({ alignment }),
          actions.handleFetchPreducates(),
        ]);
      }
    } finally {
      actions.setLoading(false);
    }
  }),
});
