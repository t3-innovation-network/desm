import { decamelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const checkCPStructureValidity = async (structure) => {
  let payload = {
    configurationProfile: {
      structure,
    },
  };

  const response = await apiRequest({
    url: '/api/v1/validate_configuration_profile',
    method: 'post',
    successResponse: 'validity',
    payload: decamelizeKeys(payload),
  });
  return response;
};

export default checkCPStructureValidity;
