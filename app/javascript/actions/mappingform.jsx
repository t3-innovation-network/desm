/**
 * Represents the form submit action for the mapping form
 *
 * @returns {Object}
 */
export const doSubmit = () => {
  return {
    type: 'SUBMIT',
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
    type: 'UNSUBMIT',
  };
};

/**
 * Represents the action of start processing a file uploaded
 * by the user
 *
 * @returns {Object}
 */
export const startProcessingFile = () => {
  return {
    type: 'START_PROCESSING_FILE',
  };
};

/**
 * Represents the action of finsish processing a file uploaded
 * by the user
 *
 * @returns {Object}
 */
export const stopProcessingFile = () => {
  return {
    type: 'STOP_PROCESSING_FILE',
  };
};

/**
 * Put the mapping form data in the store.
 *
 * @returns {Object}
 */
export const setMappingFormData = (data) => {
  return {
    type: 'SET_MAPPING_FORM_DATA',
    payload: data,
  };
};

/**
 * Remove the mapping form data in the store
 *
 * @returns {Object}
 */
export const unsetMappingFormData = () => {
  return {
    type: 'UNSET_MAPPING_FORM_DATA',
  };
};

/**
 * Put the mapping form errors in the store.
 *
 * @returns {Object}
 */
export const setMappingFormErrors = (errors) => {
  return {
    type: 'SET_MAPPING_FORM_ERRORS',
    payload: errors,
  };
};

/**
 * Remove the mapping form errors in the store
 *
 * @returns {Object}
 */
export const unsetMappingFormErrors = () => {
  return {
    type: 'UNSET_MAPPING_FORM_ERRORS',
  };
};
