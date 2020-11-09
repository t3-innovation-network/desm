/**
 * Represents setting the vocabularies when the user uploads the files
 *
 * @returns {Array}
 */
export const setVocabularies = (vocabularies) => {
  return {
    type: "SET_VOCABULARIES",
    payload: vocabularies,
  };
};

/**
 * Represents setting the vocabularies to an empty array
 *
 * @returns {Array}
 */
export const unsetVocabularies = () => {
  return {
    type: "UNSET_VOCABULARIES",
  };
};
