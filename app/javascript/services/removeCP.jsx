import apiRequest from './api/apiRequest';

const removeCP = async (id) => {
  return await apiRequest({
    url: `/api/v1/configuration_profiles/${id}`,
    method: 'delete',
  });
};

export default removeCP;
