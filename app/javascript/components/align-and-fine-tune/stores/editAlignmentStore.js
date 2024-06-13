import { action, computed } from 'easy-peasy';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import { noMatchPredicate } from './mappingStore';

export const defaultState = {
  // status
  commentChanged: false,
  loading: false,
  // options
  // data
  comment: null,
};

export const editAlignmentStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  selectedNoMatchPredicate: computed((state, predicate) => noMatchPredicate(predicate)),

  // actions
  handleCommentChange: action((state, payload) => {
    state.commentChanged = true;
    state.comment = payload;
  }),
  // thunks
});
