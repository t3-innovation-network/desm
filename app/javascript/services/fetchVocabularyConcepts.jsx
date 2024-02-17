import apiRequest from './api/apiRequest';

const fetchVocabularyConcepts = async (vocabId) => {
  return await apiRequest({
    url: '/api/v1/vocabularies/' + vocabId,
    defaultResponse: [],
    successResponse: 'vocabulary',
    method: 'get',
  });
};

export default fetchVocabularyConcepts;
