import { each, remove } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';
import { action, computed, thunk } from 'easy-peasy';
import { showSuccess } from '../../../helpers/Messages';
import deleteMapping from '../../../services/deleteMapping';
import downloadExportedMappings from '../../../services/downloadExportedMappings';
import fetchMappings from '../../../services/fetchMappings';
import updateMapping from '../../../services/updateMapping';
import fetchSpineSpecifications from '../../../services/fetchSpineSpecifications';
import { processMessage } from '../../../services/api/apiService';
import { pick } from 'lodash';

/**
 * The options object to use in the select component
 */
export const FILTER_OPTIONS = [
  {
    key: 'user',
    value: 'Only My Mappings',
  },
  {
    key: 'all',
    value: 'All Mappings',
  },
];

export const MAPPING_STATUSES = {
  readyToUpload: 'ready_to_upload',
  uploaded: 'uploaded',
  mapped: 'mapped',
  inProgress: 'in_progress',
};

export const defaultState = {
  // status
  // Controls displaying the removal confirmation dialog
  confirmingRemove: false,

  // options
  // filter value to configure the query to get the specifications
  filter: 'user',

  // data
  // The list of mappings to display
  mappings: [],
  /**
   * The identifier of the mapping to be removed. Saved in state, because the id is in an iterator,
   * and the clicked handles confirmation, and the confirmation is outside the iterator.
   */
  mappingIdToRemove: null,
  // mapping that is being processed (removed/updated/exported)
  mappingIdLoading: null,
  // the list of spines
  spines: [],
  // The ID of the currently selected configuration profile
  configurationProfileId: null,
};

export const specsListStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  isDisabled: computed(
    (state) => state.mappingIdLoading !== null || state.mappingIdToRemove !== null
  ),

  // actions
  updateMappingStatus: action((state, { mappingId, status }) => {
    const idx = state.mappings.findIndex((m) => m.id === mappingId);
    if (idx < 0) return;
    state.mappings[idx].status = status;
    each(MAPPING_STATUSES, (value, _k) => {
      state.mappings[idx][`${value}?`] = value === status;
    });
  }),
  confirmRemove: action((state, mappingId) => {
    state.confirmingRemove = true;
    state.mappingIdToRemove = mappingId;
  }),
  cancelRemove: action((state) => {
    state.confirmingRemove = false;
    state.mappingIdToRemove = null;
  }),
  removeMapping: action((state, mappingId) => {
    remove(state.mappings, (m) => m.id === mappingId);
    state.confirmRemove = false;
    state.mappingIdToRemove = null;
  }),

  // thunks
  // Send a request to delete the selected mapping.
  handleRemoveMapping: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();
    try {
      let response = await deleteMapping(state.mappingIdToRemove);

      if (state.withoutErrors(response)) {
        showSuccess('Mapping removed');
        actions.removeMapping(state.mappingIdToRemove);
      } else {
        actions.setError(response.error);
      }
      return response;
    } finally {
      actions.setMappingIdToRemove(null);
    }
  }),
  // Use the service to get all the available domains
  handleUpdateMappingStatus: thunk(async (actions, params = {}, h) => {
    const { mappingId, status } = params;
    const state = h.getState();
    actions.setMappingIdLoading(mappingId);
    try {
      const response = await updateMapping({
        id: mappingId,
        status,
      });
      if (state.withoutErrors(response)) {
        actions.updateMappingStatus({ mappingId, status });
        showSuccess('Status changed!');
      } else {
        actions.setError(response.error);
      }
      return response;
    } finally {
      actions.setMappingIdLoading(null);
    }
  }),
  downloadExportedMappings: thunk(async (actions, params = {}, h) => {
    const state = h.getState();
    actions.setMappingIdLoading(params.id);

    try {
      await downloadExportedMappings(pick(params, ['domainIds', 'format', 'mapping']));
    } catch (e) {
      actions.setError(processMessage(e));
    } finally {
      actions.setMappingIdLoading(null);
    }
  }),
  fetchMappings: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();

    const response = await fetchMappings(state.filter);

    if (state.withoutErrors(response)) {
      actions.setMappings(response.mappings);
    } else {
      actions.setError(response.error);
    }
  }),
  fetchSpineSpecifications: thunk(async (actions, _params = {}, h) => {
    const state = h.getState();

    const response = await fetchSpineSpecifications(state.filter);

    if (state.withoutErrors(response)) {
      actions.setSpines(response.specifications);
    } else {
      actions.setError(response.error);
    }
  }),
  // Fetch all the necessary data from the API
  fetchDataFromAPI: thunk(async (actions, _params = {}, _h) => {
    actions.setLoading(true);
    Promise.all([actions.fetchMappings(), actions.fetchSpineSpecifications()]);
    actions.setLoading(false);
  }),
});
