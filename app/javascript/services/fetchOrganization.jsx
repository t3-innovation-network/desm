import apiRequest from './api/apiRequest';

const fetchOrganization = async (organization_id) => {
  return await apiRequest({
    url: '/api/v1/organizations/' + organization_id,
    method: 'get',
    successResponse: 'organization',
  });
};

export default fetchOrganization;
