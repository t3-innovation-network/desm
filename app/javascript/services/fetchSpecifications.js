import apiRequest from './api/apiRequest';

const fetchSpecifications = async (queryParams = {}) => {
  return await apiRequest({
    url: '/api/v1/specifications',
    method: 'get',
    defaultResponse: [],
    successResponse: 'specifications',
    queryParams,
  });
};

export default fetchSpecifications;
