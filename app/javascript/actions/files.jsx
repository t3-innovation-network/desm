/**
 * Represents setting the files to an array of files, containing
 * the user selected files
 *
 * @returns {Array}
 */
export const setFiles = (files) => {
  return {
    type: 'SET_FILES',
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
    type: 'UNSET_FILES',
  };
};

/**
 * Represents setting the specification to preview
 *
 * @returns {Array}
 */
export const setSpecToPreview = (specs) => {
  return {
    type: 'SET_PREVIEW_SPECS',
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
    type: 'UNSET_PREVIEW_SPECS',
    payload: specs,
  };
};

/**
 * Represents setting the merged file to valid unified file, containing
 * the user selected files as only one
 *
 * @returns {Array}
 */
export const setMergedFileId = (fileId) => {
  return {
    type: 'SET_MERGED_FILE',
    payload: fileId,
  };
};

/**
 * Represents setting the merged file to an empty object
 *
 * @returns {Array}
 */
export const unsetMergedFileId = () => {
  return {
    type: 'UNSET_MERGED_FILE',
  };
};

/**
 * Represents the file filtered by the classes the user selected
 *
 * @returns {Array}
 */
export const setFilteredFile = (fileContent) => {
  return {
    type: 'SET_FILTERED_FILE',
    payload: fileContent,
  };
};

/**
 * Represents setting the filtered file to an empty object
 *
 * @returns {Array}
 */
export const unsetFilteredFile = () => {
  return {
    type: 'UNSET_FILTERED_FILE',
  };
};
