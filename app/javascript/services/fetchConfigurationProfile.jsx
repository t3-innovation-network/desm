import apiRequest from './api/apiRequest';

const fetchConfigurationProfile = async (cpId) => {
  return await apiRequest({
    url: `/api/v1/configuration_profiles/${cpId}`,
    method: 'get',
    successResponse: 'configurationProfile',
  });
};

export default fetchConfigurationProfile;
