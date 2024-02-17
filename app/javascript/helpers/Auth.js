// TODO: check if it'll work the same way if to move from webpacker
const adminRoleName = process.env.ADMIN_ROLE_NAME || 'Super Admin'; // eslint-disable-line no-undef

export function isAdmin(user) {
  return user.roles.some(
    (r) => r.name.localeCompare(adminRoleName, undefined, { sensitivity: 'accent' }) === 0
  );
}
