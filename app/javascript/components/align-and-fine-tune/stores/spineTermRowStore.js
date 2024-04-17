import { action } from 'easy-peasy';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';

export const defaultState = {
  // status
  // The selected mode to open the edit window
  editMode: 'comment',
  // Whether we are editing the alignment or not. Set to true when
  // the user selects an option from the alignment dropdown after selecting a predicate
  editing: false,
  // Whether we are matching vocabulary for the alignment or not. Set to true when
  // the user clicks on the vocabulary link on the mapped term of this alignment
  matchingVocab: false,
  // options
  // data
  // The term we are using to match vocabularies against the spine
  mappedTermMatching: null,
  // The predicate option selected
  predicateOption: null,
  // The predicate option definition
  predicateDefinition: null,
};

export const spineTermRowStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed

  // actions
  handleMatchVocabularyClick: action((state, payload) => {
    state.matchingVocab = true;
    state.mappedTermMatching = payload;
  }),
  handlePredicateOptionSelected: action((state, payload) => {
    state.editing = true;
    state.editMode = payload.name.toLowerCase();
  }),
  // thunks
});
