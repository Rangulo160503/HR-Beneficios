import { authorizeRole } from "../../reglas/auth/authorizeRole";
import { isSessionExpired } from "../../reglas/session/isSessionExpired";

export const SessionStatus = Object.freeze({
  OK: "OK",
  SHOW_LOGIN: "SHOW_LOGIN",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  ERROR: "ERROR",
});

const defaultRoleSelector = (session) =>
  session?.roles || session?.user?.roles || (session?.role ? [session.role] : []);

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
  sessionVerifier,
} = {}) {
  try {
    const session = sessionStore?.getSession?.() ?? null;

    if (!session || !sessionValidator(session)) {
      return { status: SessionStatus.SHOW_LOGIN, session: null };
    }

    const roles = roleSelector(session) || [];
    if (!authorizeRole(roles, requiredRoles)) {
      return { status: SessionStatus.NOT_AUTHORIZED, session };
    }

    if (sessionVerifier) {
      const isValid = await sessionVerifier(session);
      if (!isValid) {
        sessionStore?.clearSession?.();
        return { status: SessionStatus.SHOW_LOGIN, session: null };
      }
    }

    return { status: SessionStatus.OK, session };
  } catch (error) {
    return { status: SessionStatus.ERROR, error };
  }
}
