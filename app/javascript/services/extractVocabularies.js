import apiRequest from './api/apiRequest';

const extractVocabularies = async (content) => {
  return await apiRequest({
    url: '/api/v1/vocabularies/extract',
    method: 'post',
    payload: { content },
    defaultResponse: [],
    successResponse: 'vocabularies',
  });
};

export default extractVocabularies;
