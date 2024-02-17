import apiRequest from './api/apiRequest';

const importCP = async (data) => {
  return await apiRequest({
    url: '/api/v1/configuration_profiles/import',
    method: 'post',
    payload: data,
  });
};

export default importCP;
