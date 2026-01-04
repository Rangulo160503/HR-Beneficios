import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ProveedorLogin from "./proveedor/pages/ProveedorLogin";
import ProveedorHome from "./views/ProveedorHome";
import NotAuthorized from "./components/NotAuthorized";
import { Api } from "./services/api";
import { clearSession, getRole, getSession, isExpired } from "./utils/hrSession";

function useSharedSession() {
  const location = useLocation();
  return useMemo(() => getSession(), [location.key]);
}

function RequireProveedorSession({ children }) {
  const location = useLocation();
  const session = useSharedSession();
  const [status, setStatus] = useState("checking");
  const role = getRole(session);
  const expired = isExpired(session);

  useEffect(() => {
    let alive = true;

    if (!session || expired) {
      clearSession();
      setStatus("unauth");
      return () => {
        alive = false;
      };
    }

    if (role !== "Proveedor") {
      setStatus("forbidden");
      return () => {
        alive = false;
      };
    }

    const validate = async () => {
      try {
        setStatus("checking");
        const subjectId = session.subjectId || session.proveedorId || session.token;
        await Api.proveedores.validarLogin(subjectId);
        if (!alive) return;
        setStatus("ok");
      } catch (err) {
        if (!alive) return;
        console.error("Error validando sesión proveedor", err);
        clearSession();
        setStatus("unauth");
      }
    };

    validate();

    return () => {
      alive = false;
    };
  }, [expired, role, session]);

  if (!session || expired || status === "unauth") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (status === "forbidden") {
    return <NotAuthorized loginPath="/login" />;
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm text-white/70">Validando sesión...</p>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<ProveedorLogin />} />
      <Route
        path="/*"
        element={
          <RequireProveedorSession>
            <ProveedorHome />
          </RequireProveedorSession>
        }
      />
    </Routes>
  );
}
