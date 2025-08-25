import { decamelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const createSpineTermVocabularies = async (data) => {
  const response = await apiRequest({
    url: '/api/v1/vocabularies/spine_term',
    method: 'post',
    payload: decamelizeKeys(data),
  });
  return response;
};

export default createSpineTermVocabularies;
