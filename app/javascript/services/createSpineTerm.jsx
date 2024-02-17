import { decamelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const createSpineTerm = async (data) => {
  const response = await apiRequest({
    url: '/api/v1/spine_terms',
    method: 'post',
    payload: decamelizeKeys(data),
  });
  return response;
};

export default createSpineTerm;
