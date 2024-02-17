import apiRequest from './api/apiRequest';

const fetchMapping = async (mapping_id) => {
  return await apiRequest({
    url: '/api/v1/mappings/' + mapping_id,
    method: 'get',
    successResponse: 'mapping',
  });
};

export default fetchMapping;
