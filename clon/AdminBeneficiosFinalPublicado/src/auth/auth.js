const AUTH_KEY = "hr_admin_auth";

export function saveSession(session) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function getSession() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (!parsed?.token) return null;

    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      clearSession();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  return !!getSession();
}
