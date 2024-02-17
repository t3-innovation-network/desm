/**
 * Represents the errors in the mapping form. Since it's multiple components
 * and errors can occur in different files, to avoid passing errors on props
 * or having error messages in different parts of the screen, this reducer
 * gathers the mapping form errors.
 *
 * @returns {Array}
 */
const mappingFormErrorsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_MAPPING_FORM_ERRORS':
      return action.payload;
    case 'UNSET_MAPPING_FORM_ERRORS':
      return [];
    default:
      return state;
  }
};

export default mappingFormErrorsReducer;
