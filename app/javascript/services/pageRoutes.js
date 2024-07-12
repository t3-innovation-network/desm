import queryString from 'query-string';
import { MAPPING_PATH_BY_STATUS } from '../components/Routes';

export const pageRoutes = {
  // dashboard:
  dashboard: () => '/dashboard',
  admins: () => '/dashboard/admins',
  agents: () => '/dashboard/agents',
  users: () => '/dashboard/users',
  organizations: () => '/dashboard/organizations',
  configurationProfiles: () => '/dashboard/configuration-profiles',
  configurationProfile: (id) => `/dashboard/configuration-profiles/${id}`,
  // mappings
  mappingsList: (cp, abstractClass = null) => {
    const params = queryString.stringify({ cp, abstractClass }, { skipNull: true });
    return `/mappings-list${params ? `?${params}` : ''}`;
  },
  mappingPropertiesList: (mappingId) => `/mappings/${mappingId}/properties`,
  mappingByStatus: (mappingId, status) => {
    return `/mappings/${mappingId}/${MAPPING_PATH_BY_STATUS[status]}`;
  },
  mappingReadyToUpload: (mappingId) =>
    `/mappings/${mappingId}/${MAPPING_PATH_BY_STATUS['ready_to_upload']}`,
  mappingUploaded: (mappingId) => `/mappings/${mappingId}/${MAPPING_PATH_BY_STATUS['uploaded']}`,
  mappingInProgress: (mappingId) =>
    `/mappings/${mappingId}/${MAPPING_PATH_BY_STATUS['in_progress']}`,
  mappingNew: () => '/new-mapping',
};
