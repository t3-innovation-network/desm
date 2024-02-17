import { decamelizeKeys, camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const createAdmin = async (data) => {
  let response = await apiRequest({
    url: '/api/v1/admins/',
    method: 'post',
    payload: { admin: decamelizeKeys(data) },
    successResponse: 'admin',
  });

  return camelizeKeys(response);
};

export default createAdmin;
