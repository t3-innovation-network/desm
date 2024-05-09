import apiRequest from './api/apiRequest';

const fetchAgents = async (queryParams = {}) => {
  return await apiRequest({
    url: '/api/v1/agents',
    method: 'get',
    defaultResponse: [],
    successResponse: 'agents',
    camelizeKeys: true,
    queryParams: queryParams,
  });
};

export default fetchAgents;
