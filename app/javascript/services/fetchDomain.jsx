import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchDomain = async (domainId) => {
  const response = await apiRequest({
    url: '/api/v1/domains/' + domainId,
    method: 'get',
    successResponse: 'domain',
  });

  return camelizeKeys(response);
};

export default fetchDomain;
