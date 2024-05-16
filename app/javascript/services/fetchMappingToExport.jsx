import apiRequest from './api/apiRequest';

const fetchMappingToExport = async (mapping, format) => {
  return await apiRequest({
    url: `/api/v1/mappings/${mapping.id}/export.${format}`,
    method: 'get',
    successResponse: 'exportedMapping',
  });
};

export default fetchMappingToExport;
