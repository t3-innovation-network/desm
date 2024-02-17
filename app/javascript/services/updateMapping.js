import apiRequest from './api/apiRequest';

const updateMapping = async (mapping) => {
  return await apiRequest({
    url: '/api/v1/mappings/' + mapping.id,
    method: 'put',
    payload: mapping,
  });
};

export default updateMapping;
