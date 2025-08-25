import { uniqBy } from 'lodash';
import { vocabName } from '../helpers/Vocabularies';

/**
 * Represents setting the vocabularies when the user uploads the files
 *
 * @returns {Array}
 */
export const setVocabularies = (vocabularies) => {
  const uniqueVocabularies = uniqBy(vocabularies, (v) => vocabName(v, 1));

  return {
    type: 'SET_VOCABULARIES',
    payload: uniqueVocabularies,
  };
};

/**
 * Represents setting the vocabularies to an empty array
 *
 * @returns {Array}
 */
export const unsetVocabularies = () => {
  return {
    type: 'UNSET_VOCABULARIES',
  };
};
