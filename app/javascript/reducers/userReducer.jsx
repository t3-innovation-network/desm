/**
 * Sets the user object to an empty object or a valid one
 * depending on the action
 *
 * @returns {Object}
 */
const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return {};
    default:
      return state;
  }
};

export default userReducer;
