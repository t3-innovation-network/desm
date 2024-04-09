import { action, computed } from 'easy-peasy';
import { isUndefined } from 'lodash';

/**
 * Returns the next id for a given "in-memory" collection with negative sign to avoid conflicts with server ids.
 *
 * @param {Array} collection
 */
export const nextId = (collection) => {
  return -(
    1 + collection.reduce((max, elem) => (Math.abs(elem.id) > max ? Math.abs(elem.id) : max), 0)
  );
};

// base model for local components stores
export const baseModel = (runtimeModel) => ({
  // model
  loading: true,
  errors: runtimeModel?.error ? [runtimeModel.error] : [],

  // computed
  hasErrors: computed((state) => state.errors.length > 0),
  withoutErrors: computed((_state) => (response) => isUndefined(response.error)),

  // actions
  addError: action((state, message) => {
    state.errors.push(message);
  }),
  clearErrors: action((state) => {
    state.errors = [];
  }),
  setError: action((state, message) => {
    state.errors = [message];
  }),
  setLoading: action((state, loading) => {
    state.loading = loading;
  }),
});
