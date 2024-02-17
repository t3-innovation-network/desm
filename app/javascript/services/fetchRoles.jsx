import apiRequest from './api/apiRequest';

const fetchRoles = async () => {
  return await apiRequest({
    url: '/api/v1/roles',
    method: 'get',
    defaultResponse: [],
    successResponse: 'roles',
  });
};

export default fetchRoles;
