import apiRequest from './api/apiRequest';

const signIn = async (email, password) => {
  return await apiRequest({
    url: '/sessions',
    method: 'post',
    payload: {
      user: {
        email: email,
        password: password,
      },
    },
    defaultResponse: {},
    successResponse: 'user',
  });
};

export default signIn;
