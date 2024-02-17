import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchAdmins = async () => {
  let response = await apiRequest({
    url: '/api/v1/admins/',
    method: 'get',
    successResponse: 'admins',
  });

  return camelizeKeys(response);
};

export default fetchAdmins;
