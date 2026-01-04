/**
 * @typedef {Object} Session
 * @property {string} [token]
 * @property {string} [access_token]
 * @property {number|string} [expiresAt]
 * @property {number|string} [expires_at]
 * @property {Object} [user]
 * @property {string[]} [roles]
 * @property {string|number} [proveedorId]
 */

export function normalizeSession(raw) {
  if (!raw || typeof raw !== "object") return null;
  return raw;
}
