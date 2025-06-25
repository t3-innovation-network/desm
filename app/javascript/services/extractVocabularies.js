import apiRequest from './api/apiRequest';

const extractVocabularies = async (data) => {
  return await apiRequest({
    url: '/api/v1/vocabularies/extract',
    method: 'post',
    payload: data,
    defaultResponse: [],
    successResponse: 'vocabularies',
    options: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    formData: true,
  });
};

export default extractVocabularies;
