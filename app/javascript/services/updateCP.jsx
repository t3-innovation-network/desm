import apiRequest from './api/apiRequest';

const updateCP = async (id, data) => {
  let payload = {
    configurationProfile: data,
  };

  return await apiRequest({
    url: `/api/v1/configuration_profiles/${id}`,
    method: 'put',
    successResponse: 'configurationProfile',
    payload: payload,
    trimPayload: true,
    camelizeKeys: true,
  });
};

export default updateCP;
