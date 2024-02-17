import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchConfigurationProfiles = async () => {
  let response = await apiRequest({
    url: '/api/v1/configuration_profiles',
    method: 'get',
    defaultResponse: [],
    successResponse: 'configurationProfiles',
  });

  return camelizeKeys(response);
};

export default fetchConfigurationProfiles;
