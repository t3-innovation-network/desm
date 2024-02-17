import { decamelizeKeys, camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const updateAdmin = async (id, data) => {
  let response = await apiRequest({
    url: `/api/v1/admins/${id}`,
    method: 'patch',
    payload: { admin: decamelizeKeys(data) },
    successResponse: 'admin',
  });

  return camelizeKeys(response);
};

export default updateAdmin;
