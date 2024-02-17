import apiRequest from './api/apiRequest';

const signOut = async () => {
  return await apiRequest({
    url: '/logout',
    method: 'delete',
  });
};

export default signOut;
