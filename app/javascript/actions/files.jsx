/**
 * Represents setting the files to an array of files, containing
 * the user selected files
 *
 * @returns {Array}
 */
export const setFiles = (files) => {
  return {
    type: "SET_FILES",
    payload: files,
  };
};

/**
 * Represents setting the selected files to an empty array
 *
 * @returns {Array}
 */
export const unsetFiles = () => {
  return {
    type: "UNSET_FILES",
  };
};

/**
 * Represents setting the specification to preview
 *
 * @returns {Array}
 */
export const setSpecToPreview = (specs) => {
  return {
    type: "SET_PREVIEW_SPECS",
    payload: specs,
  };
};

/**
 * Represents unsetting the preview specifications
 *
 * @returns {Array}
 */
export const unsetSpecToPreview = (specs) => {
  return {
    type: "UNSET_PREVIEW_SPECS",
    payload: specs,
  };
};
