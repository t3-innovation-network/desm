/**
 * Represents the session status, being it a boolean value, that stands
 * for 'logged in' or 'logged out' with true and false respectively.
 *
 * @returns {Boolean}
 */
const loggedReducer = (state = false, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return true;
    case 'SIGN_OUT':
      return false;
    default:
      return state;
  }
};

export default loggedReducer;
