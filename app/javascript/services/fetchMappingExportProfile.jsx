import apiRequest from './api/apiRequest';

const fetchMappingExportProfile = async (cpId, domainSlug) => {
  return await apiRequest({
    url: `/resources/configuration-profiles/${cpId}/mapping_export_profile/${domainSlug}`,
    method: 'get',
    successResponse: 'mappingExportProfile',
  });
};

export default fetchMappingExportProfile;
