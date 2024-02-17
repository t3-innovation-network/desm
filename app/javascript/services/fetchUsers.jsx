import apiRequest from './api/apiRequest';

const fetchUsers = async () => {
  return await apiRequest({
    url: '/users',
    method: 'get',
    defaultResponse: [],
    successResponse: 'users',
  });
};

export default fetchUsers;
