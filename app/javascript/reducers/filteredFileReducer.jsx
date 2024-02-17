/**
 * Sets the filtered file object to an empty object or a valid one
 * depending on the action
 *
 * This represents a new version of the file that the user uploaded, now
 * containing only those properties that are related to the classes the
 * user selected.
 *
 * @returns {Array}
 */
const filteredFileReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FILTERED_FILE':
      return action.payload;
    case 'UNSET_FILTERED_FILE':
      return {};
    default:
      return state;
  }
};

export default filteredFileReducer;
