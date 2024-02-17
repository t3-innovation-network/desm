import apiRequest from './api/apiRequest';

async function fetchUser(user_id) {
  const response = await apiRequest({
    url: '/users/' + user_id,
    method: 'get',
    defaultResponse: {},
    successResponse: 'user',
  });
  /// We have a list of users from the backend
  if (!response.error) {
    return {
      user: {
        fullname: response.user.fullname,
        email: response.user.email,
        organization_id: response.user.organization_id,
        role_id: response.user.roles[0].id,
      },
    };
  }

  return response;
}

export default fetchUser;
