import apiRequest from './api/apiRequest';

const fetchOrganizations = async () => {
  return await apiRequest({
    url: '/api/v1/organizations',
    method: 'get',
    defaultResponse: [],
    successResponse: 'organizations',
  });
};

export default fetchOrganizations;
