import { authorizeRole } from "../../reglas/auth/authorizeRole";
import { isSessionExpired } from "../../reglas/session/isSessionExpired";

export const SessionStatus = Object.freeze({
  OK: "OK",
  SHOW_LOGIN: "SHOW_LOGIN",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  ERROR: "ERROR",
});

const defaultRoleSelector = (session) =>
  session?.roles || session?.user?.roles || session?.user?.Roles || [];

const defaultSessionValidator = (session) => {
  if (!session || typeof session !== "object") return false;
  if (isSessionExpired(session)) return false;

  if (Object.prototype.hasOwnProperty.call(session, "access_token")) {
    return Boolean(session.access_token);
  }

  if (Object.prototype.hasOwnProperty.call(session, "token")) {
    return Boolean(session.token);
  }

  return true;
};

export async function validateSessionAndAuthorize({
  sessionStore,
  requiredRoles = [],
  roleSelector = defaultRoleSelector,
  sessionValidator = defaultSessionValidator,
  meEndpoint,          // 👈 NUEVO: si viene, valida contra backend por cookie
  apiBase,             // 👈 opcional: para no hardcodear
} = {}) {
  try {
    // ✅ 1) Modo cookie (SSO real): si meEndpoint existe, NO dependas de localStorage
    if (meEndpoint) {
      const base =
        apiBase ||
        import.meta.env.VITE_API_BASE ||
        import.meta.env.VITE_API_BASE_LOCAL ||
        "https://localhost:5001";

      const url = `${String(base).replace(/\/+$/, "")}${meEndpoint}`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include", // 👈 CLAVE: manda hr_access
        headers: { Accept: "application/json" },
      });

      if (res.status === 401 || res.status === 403) {
        return { status: SessionStatus.SHOW_LOGIN, session: null };
      }

      if (!res.ok) {
        return { status: SessionStatus.ERROR, error: new Error(`HTTP ${res.status}`) };
      }

      const profile = await res.json();

      // Si el endpoint /me ya está protegido por Roles=Admin, con 200 basta.
      // Pero si tu profile trae roles, podés validarlos:
      const roles = roleSelector(profile) || [];
      if (requiredRoles.length && roles.length && !authorizeRole(roles, requiredRoles)) {
        return { status: SessionStatus.NOT_AUTHORIZED, session: profile };
      }

      return { status: SessionStatus.OK, session: profile };
    }

    // ✅ 2) Modo legacy (localStorage): se mantiene por compatibilidad
    const session = sessionStore?.getSession?.() ?? null;

    if (!session || !sessionValidator(session)) {
      return { status: SessionStatus.SHOW_LOGIN, session: null };
    }

    const roles = roleSelector(session) || [];
    if (!authorizeRole(roles, requiredRoles)) {
      return { status: SessionStatus.NOT_AUTHORIZED, session };
    }

    return { status: SessionStatus.OK, session };
  } catch (error) {
    return { status: SessionStatus.ERROR, error };
  }
}
