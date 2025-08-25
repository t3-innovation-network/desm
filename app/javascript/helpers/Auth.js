const adminRoleName = process.env.ADMIN_ROLE_NAME || 'Super Admin'; // eslint-disable-line no-undef
const mapperRoleName = process.env.MAPPER_ROLE_NAME || 'Mapper'; // eslint-disable-line no-undef

function hasRole(user, roleName) {
  if (!user?.roles) {
    return false;
  }

  return user.roles.some(
    (r) => r.name.localeCompare(roleName, undefined, { sensitivity: 'accent' }) === 0
  );
}

export function isAdmin(user) {
  return hasRole(user, adminRoleName);
}

export function isMapper(user) {
  return hasRole(user, mapperRoleName);
}
