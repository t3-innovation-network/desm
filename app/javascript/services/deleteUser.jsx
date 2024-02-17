import apiRequest from './api/apiRequest';

const deleteUser = async (user_id) => {
  const response = await apiRequest({
    url: '/users/' + user_id,
    method: 'delete',
  });
  return response;
};

export default deleteUser;
