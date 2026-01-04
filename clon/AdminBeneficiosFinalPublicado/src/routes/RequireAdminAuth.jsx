import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { clearAuth } from "../utils/adminAuth";
import { API_BASE } from "../services/apiBase";
import { clearSession, getRole, getSession, isExpired } from "../utils/hrSession";
import NotAuthorized from "../components/NotAuthorized";

export default function RequireAdminAuth({ children }) {
  const location = useLocation();
  const session = useMemo(() => getSession(), [location.key]);
  const [status, setStatus] = useState("checking");

  const role = getRole(session);
  const expired = isExpired(session);

  useEffect(() => {
    let alive = true;
    if (!session || expired) {
      clearSession();
      clearAuth();
      setStatus("unauth");
      return () => {
        alive = false;
      };
    }
    if (role !== "Admin") {
      setStatus("forbidden");
      return () => {
        alive = false;
      };
    }

    const validate = async () => {
      try {
        setStatus("checking");
        const res = await fetch(`${API_BASE}/api/AdminAuth/me`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          mode: "cors",
        });

        if (!alive) return;

        if (res.status === 401 || res.status === 403) {
          clearSession();
          clearAuth();
          setStatus("unauth");
          return;
        }

        if (!res.ok) {
          throw new Error("No se pudo validar la sesión");
        }

        setStatus("ok");
      } catch (err) {
        if (!alive) return;
        console.error("Error validando sesión admin", err);
        setStatus("error");
      }
    };

    validate();

    return () => {
      alive = false;
    };
  }, [expired, role, session]);

  if (!session || expired || status === "unauth") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (status === "forbidden") {
    return <NotAuthorized loginPath="/admin/login" />;
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm text-white/70">Validando sesión...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm text-white/70">Reintentando validación...</p>
      </div>
    );
  }

  return children || <Outlet />;
}
