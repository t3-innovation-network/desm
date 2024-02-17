import { camelizeKeys, decamelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const updateCP = async (id, data) => {
  let payload = {
    configurationProfile: data,
  };

  let response = await apiRequest({
    url: `/api/v1/configuration_profiles/${id}`,
    method: 'put',
    successResponse: 'configurationProfile',
    payload: decamelizeKeys(payload),
  });

  return camelizeKeys(response);
};

export default updateCP;
