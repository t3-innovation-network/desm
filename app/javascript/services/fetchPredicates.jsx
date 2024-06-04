import apiRequest from './api/apiRequest';

const fetchPredicates = async (queryParams = {}) => {
  return await apiRequest({
    url: '/api/v1/predicates',
    method: 'get',
    defaultResponse: [],
    successResponse: 'predicates',
    queryParams,
  });
};

export default fetchPredicates;
