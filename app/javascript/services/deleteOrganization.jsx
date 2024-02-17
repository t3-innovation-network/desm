import apiRequest from './api/apiRequest';

const deleteOrganization = async (organization_id) => {
  const response = await apiRequest({
    url: '/api/v1/organizations/' + organization_id,
    method: 'delete',
  });
  return response;
};

export default deleteOrganization;
