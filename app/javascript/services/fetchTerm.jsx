import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchTerm = async (termId, queryParams = {}) => {
  let response = await apiRequest({
    url: '/api/v1/terms/' + termId,
    method: 'get',
    defaultResponse: {},
    successResponse: 'term',
    queryParams,
  });

  return camelizeKeys(response);
};

export default fetchTerm;
