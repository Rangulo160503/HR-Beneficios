/**
 * @typedef {Object} Session
 * @property {string} [access_token]
 * @property {string} [token_type]
 * @property {string} [role]
 * @property {number|string} [expiresAt]
 * @property {number|string} [expires_at]
 * @property {Object} [user]
 * @property {string[]} [roles]
 * @property {string|number} [proveedorId]
 * @property {string} [proveedorNombre]
 */

export function normalizeSession(raw) {
  if (!raw || typeof raw !== "object") return null;
  return raw;
}
