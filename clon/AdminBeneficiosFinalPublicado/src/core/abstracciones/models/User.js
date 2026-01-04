/**
 * @typedef {Object} User
 * @property {string|number} [id]
 * @property {string} [name]
 * @property {string[]} [roles]
 */

export function normalizeUser(raw) {
  if (!raw || typeof raw !== "object") return null;
  return raw;
}
