import apiRequest from './api/apiRequest';

const fetchOrganizations = async (queryParams = {}) => {
  return await apiRequest({
    url: '/api/v1/organizations',
    method: 'get',
    defaultResponse: [],
    successResponse: 'organizations',
    queryParams,
  });
};

export default fetchOrganizations;
