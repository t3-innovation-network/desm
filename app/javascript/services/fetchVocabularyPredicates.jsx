import apiRequest from './api/apiRequest';

const fetchVocabularyPredicates = async (alignmentId) => {
  let response = await apiRequest({
    url: '/api/v1/vocabularies/predicates',
    method: 'get',
    defaultResponse: [],
    successResponse: 'predicates',
  });

  return response;
};

export default fetchVocabularyPredicates;
