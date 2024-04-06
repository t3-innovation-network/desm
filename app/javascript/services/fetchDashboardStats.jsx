import apiRequest from './api/apiRequest';

const fetchDashboardStats = async () => {
  return await apiRequest({
    url: '/api/v1/dashboard',
    method: 'get',
    defaultResponse: {},
    camelizeKeys: true,
  });
};

export default fetchDashboardStats;
