// src/core/flujo/use-cases/LoginWithCredentials.js

export async function loginWithCredentials({
  authGateway,
  // sessionStore ya no se usa en cookie-only, lo dejamos por compatibilidad
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
      options: {
        ...(options ?? {}),
        // IMPORTANTE: para que el browser acepte Set-Cookie desde la API
        credentials: options?.credentials ?? "include",
      },
    });

    // Cookie-only: el API responde { ok: true } (sin token)
    // Aceptamos cualquiera de estas señales de éxito:
    const ok =
      response?.ok === true ||
      response?.success === true ||
      response?.isOk === true;

    if (!ok) {
      // Si en algún ambiente todavía devolviera token, lo dejamos soportado:
      const token = response?.token || response?.access_token || response?.accessToken;
      if (!token) return { ok: false, message: "No se pudo iniciar sesión." };

      // (Fallback) si llega token, guardamos como antes
      const session = {
        access_token: token,
        token,
        token_type: response?.tokenType || response?.token_type || "Bearer",
        expires_at: response?.expiresAt
          ? new Date(response.expiresAt).getTime()
          : response?.expires_at,
        user: response?.profile || response?.user || null,
        roles: Array.isArray(response?.roles)
          ? response.roles
          : Array.isArray(defaultRoles)
          ? defaultRoles
          : [],
      };

      sessionStore?.save?.(session);
      return { ok: true, session, response };
    }

    // ✅ Cookie-only success (no guardamos nada en localStorage)
    return { ok: true, response };
  } catch (error) {
    return {
      ok: false,
      message: error?.message || "No se pudo iniciar sesión.",
      error,
    };
  }
}