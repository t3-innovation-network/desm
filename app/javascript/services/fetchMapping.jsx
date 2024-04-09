import apiRequest from './api/apiRequest';

const fetchMapping = async (mappingId) => {
  return await apiRequest({
    // mappings#show
    url: '/api/v1/mappings/' + mappingId,
    method: 'get',
    successResponse: 'mapping',
  });
};

export default fetchMapping;
