import axios from 'axios';

const fetchExternalVocabulary = async (vocabularyURL) => {
  try {
    const response = await axios.get(vocabularyURL);
    return { vocabulary: response.data };
  } catch (e) {
    return { error: e.message };
  }
};

export default fetchExternalVocabulary;
