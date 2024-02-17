import apiRequest from './api/apiRequest';
import { decamelizeKeys } from 'humps';

const updateUser = async (id, data) => {
  return await apiRequest({
    url: `/users/${id}`,
    method: 'patch',
    payload: { user: decamelizeKeys(data) },
    successResponse: 'user',
  });
};

export default updateUser;
