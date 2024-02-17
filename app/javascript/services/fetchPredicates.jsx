import apiRequest from './api/apiRequest';

const fetchPredicates = async () => {
  return await apiRequest({
    url: '/api/v1/predicates',
    method: 'get',
    defaultResponse: [],
    successResponse: 'predicates',
  });
};

export default fetchPredicates;
