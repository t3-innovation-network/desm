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
  mappingsList: (cp, abstractClass = null) =>
    `/mappings-list${cp ? `?cp=${cp}` : ''}${
      abstractClass ? `${cp ? '&' : '?'}abstractClass=${abstractClass}` : ''
    }`,
};
