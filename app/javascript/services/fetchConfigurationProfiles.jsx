import apiRequest from './api/apiRequest';

const REQUEST_TYPES = {
  index: 'configuration_profiles',
  indexForUser: 'configuration_profiles/index_for_user',
  indexWithSharedMappings: 'configuration_profiles/index_shared_mappings',
};

const fetchConfigurationProfiles = async (requestType = 'index', queryParams = {}) => {
  return await apiRequest({
    url: `/api/v1/${REQUEST_TYPES[requestType]}`,
    method: 'get',
    defaultResponse: [],
    successResponse: 'configurationProfiles',
    camelizeKeys: true,
    queryParams: queryParams,
  });
};

export default fetchConfigurationProfiles;
