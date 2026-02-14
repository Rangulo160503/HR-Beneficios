import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LandingShell from "./LandingShell";
import NotAuthorized from "./NotAuthorized";
import {
  SessionStatus,
  validateSessionAndAuthorize,
} from "../core/flujo/use-cases/ValidateSessionAndAuthorize";
import { landingSessionStore } from "../core-config/sessionStores";

const validateLandingSession = (session) => Boolean(session?.token);

export default function Gate() {
  const [status, setStatus] = useState(SessionStatus.OK);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await validateSessionAndAuthorize({
        sessionStore: landingSessionStore,
        sessionValidator: validateLandingSession,
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

  return <LandingShell />;
}
