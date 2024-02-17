/**
 * Sets the vocabularies collection (on upload phase) to an empty array or a valid one
 * depending on the action
 *
 * These are the vocabularies found in the files selected by the user in the attachment
 * input on the "mapping form", or in the further screens when uploading vocabularies
 * for the specification.
 *
 * @returns {Array}
 */
const vocabulariesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_VOCABULARIES':
      return action.payload;
    case 'UNSET_VOCABULARIES':
      return [];
    default:
      return state;
  }
};

export default vocabulariesReducer;
