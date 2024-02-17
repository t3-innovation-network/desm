import apiRequest from './api/apiRequest';

const deleteAdmin = async (id) => {
  return await apiRequest({
    url: `/api/v1/admins/${id}`,
    method: 'delete',
  });
};

export default deleteAdmin;
