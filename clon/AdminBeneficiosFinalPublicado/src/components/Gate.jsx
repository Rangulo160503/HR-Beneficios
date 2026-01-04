import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AdminShell from "./AdminShell/AdminShell";
import ProviderPortal from "../pages/ProviderPortal";
import NotAuthorized from "./NotAuthorized";
import {
  SessionStatus,
  validateSessionAndAuthorize,
} from "../core/flujo/use-cases/ValidateSessionAndAuthorize";
import { isSessionExpired } from "../core/reglas/session/isSessionExpired";
import { adminSessionStore, providerSessionStore } from "../core-config/sessionStores";

const validateAdminSession = (session) => {
  if (!session?.access_token) return false;
  if (isSessionExpired(session)) return false;
  return true;
};

const validateProviderSession = (session) =>
  Boolean(session?.proveedorId && session?.token);

export default function Gate() {
  const location = useLocation();
  const isAdminRoute = useMemo(
    () => location.pathname.startsWith("/admin"),
    [location.pathname]
  );
  const [status, setStatus] = useState(SessionStatus.OK);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const sessionStore = isAdminRoute
        ? adminSessionStore
        : providerSessionStore;
      const sessionValidator = isAdminRoute
        ? validateAdminSession
        : validateProviderSession;

      const result = await validateSessionAndAuthorize({
        sessionStore,
        sessionValidator,
      });

      if (!active) return;
      setStatus(result.status);
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [isAdminRoute, location.key]);

  if (status === SessionStatus.SHOW_LOGIN) {
    return (
      <Navigate to={isAdminRoute ? "/admin/login" : "/admin/login"} replace />
    );
  }

  if (status === SessionStatus.NOT_AUTHORIZED) {
    return <NotAuthorized />;
  }

  if (status === SessionStatus.ERROR) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
        <p className="text-sm text-red-300">
          No se pudo validar la sesión. Intenta nuevamente.
        </p>
      </div>
    );
  }

  return isAdminRoute ? <AdminShell /> : <ProviderPortal />;
}
