const adminRoleName = process.env.ADMIN_ROLE_NAME || "Super Admin";

export function isAdmin(user) {
  return user.roles.some(r => (
    r.name.localeCompare(adminRoleName, undefined, { sensitivity: "accent" }) === 0)
  );
}
