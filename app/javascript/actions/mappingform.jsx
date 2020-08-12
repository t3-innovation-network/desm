/**
 * Represents the form submit action for the mapping form
 *
 * @returns {Object} 
 */
export const doSubmit = () => {
  return {
    type: "SUBMIT",
  };
};

/**
 * Represents the ubsubmit action. It's the scenario when
 * the user is not satisfied with the files preview on the
 * mapping form, and want to re-upload the files
 *
 * @returns {Object} 
 */
export const doUnsubmit = () => {
  return {
    type: "UNSUBMIT",
  };
};