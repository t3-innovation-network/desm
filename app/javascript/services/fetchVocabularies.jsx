import apiRequest from './api/apiRequest';

const fetchVocabularies = async () => {
  return await apiRequest({
    url: '/api/v1/vocabularies',
    method: 'get',
    defaultResponse: [],
    successResponse: 'vocabularies',
  });
};

export default fetchVocabularies;
