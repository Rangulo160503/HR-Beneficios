// src/utils/adminAuth.js

const STORAGE_KEY = "hr_admin_auth";

export function getAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (err) {
    console.error("No se pudo leer auth", err);
    return null;
  }
}

export function setAuth(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("No se pudo guardar auth", err);
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("No se pudo limpiar auth", err);
  }
}

export function isLoggedIn() {
  const auth = getAuth();
  if (!auth?.access_token) return false;

  const expiresAt = Number(auth.expires_at);
  if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
    clearAuth();
    return false;
  }

  return true;
}
