// src/utils/hrSession.js
// Sesión compartida entre apps (admin/proveedor/colaborador) via localStorage.

const STORAGE_KEY = "hr_session";

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (err) {
    console.error("No se pudo leer la sesión compartida", err);
    return null;
  }
}

export function setSession(session) {
  try {
    if (!session) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error("No se pudo guardar la sesión compartida", err);
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("No se pudo limpiar la sesión compartida", err);
  }
}

export function isExpired(session) {
  if (!session?.expiresAt) return false;
  const expiresAt =
    typeof session.expiresAt === "string"
      ? Date.parse(session.expiresAt)
      : Number(session.expiresAt);
  if (!Number.isFinite(expiresAt)) return false;
  return expiresAt <= Date.now();
}

export function getRole(session) {
  return session?.role || null;
}
