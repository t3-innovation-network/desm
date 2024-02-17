import apiRequest from './api/apiRequest';

const fetchValidSchema = async (mappingId) => {
  return await apiRequest({
    url: '/api/v1/configuration_profile_schema?name=valid',
    method: 'get',
    successResponse: 'validSchema',
  });
};

export default fetchValidSchema;
