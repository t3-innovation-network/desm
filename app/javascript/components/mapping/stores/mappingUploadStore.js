import { thunk } from 'easy-peasy';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import fetchMapping from '../../../services/fetchMapping';

export const defaultState = {
  // status

  // options

  // data
  // Declare and have an initial state for the mapping
  mapping: {},
};

export const mappingUploadStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed

  // actions

  // thunks
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
  // Fetch initial data
  fetchDataFromAPI: thunk(async (actions, { mappingId }, h) => {
    // Get the mapping
    await actions.handleFetchMapping({ mappingId });
    if (!h.getState().hasErrors) actions.setLoading(false);
  }),
});
