/**
 * Represents setting the files to an array of files, containing
 * the user selected files
 *
 * @returns {Array} 
 */
export const setFiles = (files) => {
  return {
    type: "SET_FILES",
    payload: files
  }
}

/**
 * Represents setting the selected files to an empty array
 *
 * @returns {Array} 
 */
export const unsetFiles = () => {
  return {
    type: "UNSET_FILES"
  }
}