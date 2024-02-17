import apiRequest from './api/apiRequest';

const deleteMapping = async (mappingId) => {
  return await apiRequest({
    url: '/api/v1/mappings/' + mappingId,
    method: 'delete',
  });
};

export default deleteMapping;
