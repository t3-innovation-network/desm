import apiRequest from './api/apiRequest';

const createOrganization = async (data) => {
  const response = await apiRequest({
    url: '/api/v1/organizations',
    method: 'post',
    payload: data,
  });
  return response;
};

export default createOrganization;
