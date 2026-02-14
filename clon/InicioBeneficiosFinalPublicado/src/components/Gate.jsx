import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

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
    return () => (active = false);
  }, []);

  // ✅ En el Landing, /login sí debe mostrar LoginFormScreen (no LandingShell)
  if (status === SessionStatus.SHOW_LOGIN && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (status === SessionStatus.NOT_AUTHORIZED) return <NotAuthorized />;
  if (status === SessionStatus.ERROR) return <div>Error validando sesión</div>;

  return <LandingShell />;
}
