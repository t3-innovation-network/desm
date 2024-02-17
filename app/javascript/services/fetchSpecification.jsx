import apiRequest from './api/apiRequest';

const fetchSpecification = async (specId) => {
  return await apiRequest({
    url: '/api/v1/specifications/' + specId,
    method: 'get',
    defaultResponse: {},
    successResponse: 'specification',
  });
};

export default fetchSpecification;
