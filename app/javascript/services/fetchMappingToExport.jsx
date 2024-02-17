import apiRequest from './api/apiRequest';

const fetchMappingToExport = async (mappingId) => {
  return await apiRequest({
    url: '/api/v1/mappings/' + mappingId + '/export',
    method: 'get',
    successResponse: 'exportedMapping',
  });
};

export default fetchMappingToExport;
