import apiRequest from './api/apiRequest';

const createCP = async (data) => {
  const response = await apiRequest({
    url: '/api/v1/configuration_profiles',
    method: 'post',
    successResponse: 'configurationProfile',
    payload: data || {
      configuration_profile: {
        name: `DESM CP - ${new Date().toISOString()}`,
      },
    },
  });
  return response;
};

export default createCP;
