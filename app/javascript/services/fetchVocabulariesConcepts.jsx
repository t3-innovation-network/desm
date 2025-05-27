import apiRequest from './api/apiRequest';

const fetchVocabulariesConcepts = async (vocabIds) => {
  return await apiRequest({
    url: `/api/v1/vocabularies/concepts?ids=${vocabIds.join(',')}`,
    defaultResponse: [],
    method: 'get',
  });
};

export default fetchVocabulariesConcepts;
