import apiRequest from './api/apiRequest';

const fetchAgentsFilters = async () => {
  return await apiRequest({
    url: '/api/v1/agents/filters',
    method: 'get',
    defaultResponse: [],
    successResponse: 'filters',
    camelizeKeys: true,
  });
};

export default fetchAgentsFilters;
