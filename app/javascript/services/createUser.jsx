import apiRequest from './api/apiRequest';

const createUser = async (fullname, email, organization_id, role_id) => {
  const response = await apiRequest({
    url: '/registrations',
    method: 'post',
    payload: {
      user: {
        fullname: fullname,
        email: email,
        organization_id: organization_id,
      },
      role_id: role_id,
    },
  });
  return response;
};

export default createUser;
