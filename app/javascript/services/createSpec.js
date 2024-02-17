import { decamelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const createSpec = async (data) => {
  /// Do the request
  const response = await apiRequest({
    url: '/api/v1/specifications',
    method: 'post',
    payload: {
      specification: decamelizeKeys(data),
    },
  });
  return response;
};

export default createSpec;
