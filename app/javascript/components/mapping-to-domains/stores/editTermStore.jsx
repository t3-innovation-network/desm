import { action, computed, thunk } from 'easy-peasy';
import { remove, toArray, uniqBy } from 'lodash';
import fetchTerm from '../../../services/fetchTerm';
import updateTerm from '../../../services/updateTerm';
import deleteTerm from '../../../services/deleteTerm';
import fetchVocabularies from '../../../services/fetchVocabularies';
import createVocabulary from '../../../services/createVocabulary';
import extractVocabularies from '../../../services/extractVocabularies';
import { readNodeAttribute, vocabName } from './../../../helpers/Vocabularies';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import { showWarning } from '../../../helpers/Messages';
import { i18n } from '../../../utils/i18n';

export const defaultState = {
  // status
  // Whether we are uploading vocabularies or not. Useful to show/hide the modal window to upload a vocabulary
  uploadingVocabulary: false,

  // options
  // Whether to show raw JSON or not
  expanded: false,

  // data
  // Edit data
  term: {
    name: '',
    property: {},
    vocabularies: [],
  },
  // Vocabularies
  vocabularies: [],
};

export const editTermStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  domainsAsOptions: computed((state) =>
    toArray(state.term.property.domain).map((domain, i) => ({
      id: i,
      name: readNodeAttribute(domain, '@id'),
    }))
  ),
  rangeAsOptions: computed((state) =>
    toArray(state.term.property.range).map((rng, i) => ({
      id: i,
      name: readNodeAttribute(rng, '@id'),
    }))
  ),

  // actions
  handleDomainChange: action((state, payload) => {
    if (payload.name) state.term.property.selectedDomain = payload.name;
  }),
  handleRangeChange: action((state, payload) => {
    if (payload.name) state.term.property.selectedRange = payload.name;
  }),
  handlePropertyChange: action((state, payload) => {
    const { name, value } = payload;
    state.term.property[name] = value;
  }),
  handleVocabularyChange: action((state, payload) => {
    const exists = state.term.vocabularies.find((vocab) => vocab.id == payload);
    if (exists) {
      remove(state.term.vocabularies, (vocab) => vocab.id == payload);
    } else {
      const vocab = state.vocabularies.find((vocab) => vocab.id == payload);
      if (vocab) {
        state.term.vocabularies.push(vocab);
      }
    }
  }),
  resetState: action((state) => {
    state.loading = false;
    state.errors = [];
  }),
  updateVocabularies: action((state, newVocabs) => {
    const newVocabOptions = newVocabs
      .filter(Boolean)
      .map((v) => ({ id: v.id, name: v.name, version: v.version }));
    state.vocabularies = uniqBy([...state.vocabularies, ...newVocabOptions], (v) => v.id);
    state.term.vocabularies = uniqBy([...state.term.vocabularies, ...newVocabOptions], (v) => v.id);
  }),

  // thunks
  handleSaveTerm: thunk(async (actions, _params, h) => {
    const state = h.getState();
    let response = await updateTerm(state.term);
    if (!state.withoutErrors(response)) {
      actions.addError(response.error);
    }
    return response;
  }),
  handleRemoveTerm: thunk(async (actions, _params, h) => {
    const state = h.getState();
    let response = await deleteTerm(state.term.id);
    if (!state.withoutErrors(response)) {
      actions.addError(response.error);
    }
    return response;
  }),
  handleVocabularyAdded: thunk(async (actions, data, h) => {
    document.body.classList.add('waiting');
    const state = h.getState();
    try {
      const response = await extractVocabularies(data);
      let countCreated = 0,
        countUpdated = 0,
        updateVocabularies = [];
      if (state.withoutErrors(response)) {
        const extractedVocabs = response.vocabularies;
        const newVocabs = await Promise.all(
          extractedVocabs.map(async (content) => {
            try {
              const name = vocabName(content);
              if (!name) return;
              const { vocabulary } = await createVocabulary({ vocabulary: { content, name } });
              if (vocabulary.version === 1) {
                countCreated++;
              } else {
                countUpdated++;
                updateVocabularies.push({
                  name: vocabulary.name,
                  version: vocabulary.version,
                  name_with_version: vocabulary.name_with_version,
                });
              }
              return vocabulary;
            } catch {
              return null;
            }
          })
        );
        actions.updateVocabularies(newVocabs);
        const countSaved = countCreated + countUpdated;
        if (countUpdated > 0) {
          const messageProcessed = i18n.t('ui.mapping.vocabularies.created', {
            count: countSaved,
          });
          const messageUpdated = i18n.t('ui.mapping.vocabularies.updated', {
            count: countUpdated,
            name: updateVocabularies.map((v) => `"${v.name}"`).join(', '),
            new_name: updateVocabularies.map((v) => `"${v.name_with_version}"`).join(', '),
          });
          showWarning(`${messageProcessed} ${messageUpdated}`);
        }
      }
      return response;
    } finally {
      document.body.classList.remove('waiting');
    }
  }),
  fetchTermFromApi: thunk(async (actions, { termId, vocabularyConcepts = false }, h) => {
    const state = h.getState();
    actions.setLoading(true);
    try {
      const response = await fetchTerm(termId, { vocabularyConcepts });
      if (state.withoutErrors(response)) {
        actions.setTerm(response.term);
      } else {
        actions.addError(response.error);
      }
    } finally {
      actions.setLoading(false);
    }
  }),
  getVocabularies: thunk(async (actions, _params, h) => {
    const state = h.getState();
    const response = await fetchVocabularies();
    if (state.withoutErrors(response)) {
      actions.setVocabularies(response.vocabularies);
    } else {
      actions.addError(response.error);
    }
  }),
});
