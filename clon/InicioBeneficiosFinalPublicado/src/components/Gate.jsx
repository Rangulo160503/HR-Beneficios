import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LandingShell from "./LandingShell";
import NotAuthorized from "./NotAuthorized";
import { validateSessionAndAuthorize } from "../core-config/useCases";
import { SessionStatus } from "../core/flujo/use-cases/ValidateSessionAndAuthorize";

const validateLandingSession = (session) => Boolean(session?.access_token);

export default function Gate() {
  const [status, setStatus] = useState(null); // loading

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const result = await validateSessionAndAuthorize({
          sessionValidator: validateLandingSession,
        });
        if (active) setStatus(result.status);
      } catch {
        if (active) setStatus(SessionStatus.ERROR);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (status === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando...
      </div>
    );
  }

  if (status === SessionStatus.SHOW_LOGIN) return <Navigate to="/login" replace />;
  if (status === SessionStatus.NOT_AUTHORIZED) return <NotAuthorized />;
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