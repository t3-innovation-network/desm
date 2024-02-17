import apiRequest from './api/apiRequest';

const forgotPassword = async (email) => {
  return await apiRequest({
    url: '/password/forgot',
    method: 'post',
    payload: {
      user: {
        email: email,
      },
    },
  });
};

export default forgotPassword;
