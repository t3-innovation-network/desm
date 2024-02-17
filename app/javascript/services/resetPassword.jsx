import apiRequest from './api/apiRequest';

const resetPassword = async (password, token) => {
  return await apiRequest({
    url: '/password/reset',
    method: 'post',
    payload: {
      user: {
        password: password,
        token: token,
      },
    },
  });
};

export default resetPassword;
