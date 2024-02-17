/**
 * Sets the files object to an empty array or a valid one
 * depending on the action
 *
 * These are the files selected by the user in the attachment input
 * on the "mapping form".
 *
 * @returns {Array}
 */
const fileProcessingReducer = (state = false, action) => {
  switch (action.type) {
    case 'START_PROCESSING_FILE':
      return true;
    case 'STOP_PROCESSING_FILE':
      return false;
    default:
      return state;
  }
};

export default fileProcessingReducer;
