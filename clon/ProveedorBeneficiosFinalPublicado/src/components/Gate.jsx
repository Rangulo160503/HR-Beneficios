import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import ProveedorHome from "../views/ProveedorHome";
import NotAuthorized from "./NotAuthorized";
import {
  SessionStatus,
  validateSessionAndAuthorize,
} from "../core/flujo/use-cases/ValidateSessionAndAuthorize";
import { providerSessionStore } from "../core-config/sessionStores";
import { isSessionExpired } from "../core/reglas/session/isSessionExpired";

const validateProviderSession = (session) =>
  Boolean(session?.proveedorId && session?.access_token) && !isSessionExpired(session);
const selectProviderRoles = (session) =>
  session?.roles || session?.user?.roles || session?.user?.Roles || (session?.role ? [session.role] : []);

export default function Gate() {
  const [status, setStatus] = useState(SessionStatus.OK);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tokenFromUrl = params.get("token");

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await validateSessionAndAuthorize({
        sessionStore: providerSessionStore,
        requiredRoles: ["Proveedor"],
        roleSelector: selectProviderRoles,
        sessionValidator: validateProviderSession,
      });

      if (!active) return;
      setStatus(result.status);
    };

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  if (status === SessionStatus.SHOW_LOGIN) {
    if (tokenFromUrl) {
      return (
        <Navigate to={`/login?token=${encodeURIComponent(tokenFromUrl)}`} replace />
      );
    }
    return <Navigate to="/login" replace />;
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

  return <ProveedorHome />;
}
