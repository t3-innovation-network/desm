import { action, computed } from 'easy-peasy';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import { noMatchPredicate } from './mappingStore';

export const defaultState = {
  // status
  commentChanged: false,
  currentMode: null,
  predicateChanged: false,
  // options
  // data
  comment: null,
  selectedPredicate: null,
};

export const editAlignmentStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  selectedNoMatchPredicate: computed((state) => noMatchPredicate(state.selectedPredicate)),

  // actions
  handleCommentChange: action((state, payload) => {
    state.commentChanged = true;
    state.comment = payload;
  }),
  handlePredicateSelected: action((state, payload) => {
    state.predicateChanged = true;
    state.selectedPredicate = payload;
  }),
  // thunks
});
