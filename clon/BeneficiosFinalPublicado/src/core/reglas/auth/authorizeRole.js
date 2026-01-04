export function authorizeRole(userRoles = [], requiredRoles = []) {
  if (!requiredRoles.length) return true;
  if (!Array.isArray(userRoles)) return false;
  return requiredRoles.some((role) => userRoles.includes(role));
}
