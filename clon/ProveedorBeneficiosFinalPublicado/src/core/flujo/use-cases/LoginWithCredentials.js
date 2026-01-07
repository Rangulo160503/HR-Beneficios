const parseExpiresAt = (value) => {
  if (value == null) return undefined;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? undefined : parsed;
};

const normalizeCredentialsSession = (response, defaultRoles = []) => {
  if (!response || typeof response !== "object") return null;
  const token = response.token || response.access_token || response.accessToken;
  if (!token) return null;

  const profile = response.profile || response.user || null;
  const roles = response.roles || profile?.roles || profile?.Roles || defaultRoles;

  return {
    access_token: token,
    token_type: response.tokenType || response.token_type || "Bearer",
    expires_at: parseExpiresAt(response.expiresAt || response.expires_at),
    user: profile,
    roles: Array.isArray(roles) ? roles : defaultRoles,
    role: Array.isArray(roles) && roles.length > 0 ? roles[0] : undefined,
  };
};

export async function loginWithCredentials({
  authGateway,
  sessionStore,
  usuario,
  password,
  defaultRoles = [],
  options,
} = {}) {
  if (!authGateway?.loginWithCredentials) {
    throw new Error("AuthGateway.loginWithCredentials not available");
  }

  try {
    const response = await authGateway.loginWithCredentials({
      usuario,
      password,
      options,
    });
    const session = normalizeCredentialsSession(response, defaultRoles);

    if (!session) {
      return { ok: false, message: "No se pudo iniciar sesión." };
    }

    sessionStore?.save?.(session);
    return { ok: true, session, response };
  } catch (error) {
    return { ok: false, message: error?.message || "No se pudo iniciar sesión.", error };
  }
}
