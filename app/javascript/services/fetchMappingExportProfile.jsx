import apiRequest from './api/apiRequest';

const fetchMappingExportProfile = async (domainSlug) => {
  return await apiRequest({
    url: `/resources/mapping_export_profile?slug=${domainSlug}`,
    method: 'get',
    successResponse: 'mappingExportProfile',
  });
};

export default fetchMappingExportProfile;
