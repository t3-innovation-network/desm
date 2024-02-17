/**
 * Sets the files object to an empty array or a valid one
 * depending on the action
 *
 * These are the files selected by the user in the attachment input
 * on the "mapping form".
 *
 * @returns {Array}
 */
const mappingFormReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_MAPPING_FORM_DATA':
      return action.payload;
    case 'UNSET_MAPPING_FORM_DATA':
      return {};
    default:
      return state;
  }
};

export default mappingFormReducer;
