import { decamelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const updateSpec = async (data) => {
  return await apiRequest({
    url: `/api/v1/specifications/${data.id}`,
    method: 'put',
    payload: {
      specification: decamelizeKeys(data),
    },
  });
};

export default updateSpec;
