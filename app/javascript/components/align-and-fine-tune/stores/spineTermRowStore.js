import { action } from 'easy-peasy';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';

export const defaultState = {
  // status
  // Whether we are adding comment to the alignment or not. Set to true when
  // the user selects an option from the alignment dropdown after selecting a predicate
  editing: false,
  // Whether tranformation modal is open or not
  transforming: false,
  // Whether we are matching vocabulary for the alignment or not. Set to true when
  // the user clicks on the vocabulary link on the mapped term of this alignment
  matchingVocab: false,
  // options
  // data
  // The terms we are using to match vocabularies against the spine
  mappedTermsMatching: null,
  // The predicate option selected
  predicateOption: null,
  // The predicate option definition
  predicateDefinition: null,
  // Whether the spine term shows extra details
  spineTermExpanded: false,
  // Whether the mapped term shows extra details
  mappedTermExpanded: false,
};

export const spineTermRowStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed

  // actions
  handleMatchVocabularyClick: action((state, payload) => {
    state.matchingVocab = true;
    state.mappedTermsMatching = payload;
  }),

  // thunks
});
