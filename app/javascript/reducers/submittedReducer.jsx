/**
 * Represents the status of the mapping form, being it a boolean value, that stands
 * for 'submitted' or 'not submitted' with true and false respectively.
 *
 * @returns {Boolean}
 */
const submittedReducer = (state = false, action) => {
  switch (action.type) {
    case 'SUBMIT':
      return true;
    case 'UNSUBMIT':
      return false;
    default:
      return state;
  }
};

export default submittedReducer;
