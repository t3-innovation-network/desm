import apiRequest from './api/apiRequest';

const updateOrganization = async (id, data) => {
  return await apiRequest({
    url: '/api/v1/organizations/' + id,
    method: 'put',
    payload: data,
  });
};

export default updateOrganization;
