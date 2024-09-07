import { action, computed } from 'easy-peasy';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import { assign, isEqual } from 'lodash';

export const defaultState = {
  // status
  loading: false,
  // options
  // data
  initialData: {},
  transformation: {},
};

export const transformationAlignmentStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  withChanges: computed((state) => !isEqual(state.transformation, state.initialData)),

  // actions
  handleChange: action((state, payload) => {
    assign(state.transformation, payload);
  }),
  // thunks
});
