/**
 * Represents the login action
 *
 * @returns {Object}
 */
export const doLogin = () => {
  return {
    type: 'SIGN_IN',
  };
};

/**
 * Represents the logout action
 *
 * @returns {Object}
 */
export const doLogout = () => {
  return {
    type: 'SIGN_OUT',
  };
};

/**
 * Represents setting the user to an object with all its attributes
 *
 * @returns {Object}
 */
export const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: user,
  };
};

/**
 * Represents setting the user to an empty object (remove the user from the session)
 *
 * @returns {Object}
 */
export const unsetUser = (user) => {
  return {
    type: 'UNSET_USER',
  };
};
