import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchSpineTerms = async (specId, queryParams = {}) => {
  const response = await apiRequest({
    url: '/api/v1/spines/' + specId + '/terms',
    defaultResponse: [],
    successResponse: 'terms',
    method: 'get',
    queryParams,
  });
  return camelizeKeys(response);
};

export default fetchSpineTerms;
