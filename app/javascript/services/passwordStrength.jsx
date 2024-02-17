import apiRequest from './api/apiRequest';

const passwordStrength = async (password) => {
  return await apiRequest({
    url: '/password/strength',
    method: 'post',
    payload: {
      user: {
        password: password,
      },
    },
  });
};

export default passwordStrength;
