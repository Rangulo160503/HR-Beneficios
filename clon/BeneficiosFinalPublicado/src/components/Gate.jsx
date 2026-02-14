import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ClientShell from "./ClientShell";
import NotAuthorized from "./NotAuthorized";
import {
  SessionStatus,
  validateSessionAndAuthorize,
} from "../core/flujo/use-cases/ValidateSessionAndAuthorize";
import { clientSessionStore } from "../core-config/sessionStores";

const validateClientSession = (session) => Boolean(session?.token);
const selectClientRoles = (session) =>
  session?.roles || session?.user?.roles || session?.user?.Roles || [];

export default function Gate() {
  const [status, setStatus] = useState(SessionStatus.OK);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await validateSessionAndAuthorize({
        sessionStore: clientSessionStore,
        requiredRoles: ["Client", "Usuario"],
        roleSelector: selectClientRoles,
        sessionValidator: validateClientSession,
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
    return <Navigate to="/login" replace />;
  }

  if (status === SessionStatus.NOT_AUTHORIZED) {
    return <NotAuthorized />;
  }

  if (status === SessionStatus.ERROR) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <p className="text-sm text-red-300">
          No se pudo validar la sesión. Intenta nuevamente.
        </p>
      </div>
    );
  }

  return <ClientShell />;
}
