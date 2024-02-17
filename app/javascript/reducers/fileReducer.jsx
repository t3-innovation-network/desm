/**
 * Sets the files object to an empty array or a valid one
 * depending on the action
 *
 * These are the files selected by the user in the attachment input
 * on the "mapping form".
 *
 * @returns {Array}
 */
const fileReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_FILES':
      return action.payload;
    case 'UNSET_FILES':
      return [];
    default:
      return state;
  }
};

export default fileReducer;
