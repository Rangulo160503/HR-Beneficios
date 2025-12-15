import AdminShell from "./components/AdminShell/AdminShell.jsx";
import ProviderPortal from "./pages/ProviderPortal.jsx";
import ProviderLogin from "./pages/ProviderLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useMemo } from "react";
import RequireAdminAuth from "./routes/RequireAdminAuth.jsx";

function useStoredSession(key) {
  const location = useLocation();
  const session = useMemo(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    } catch (err) {
      console.error("No se pudo leer sesión", err);
      return null;
    }
  }, [key, location.key]);

  return session;
}

function RequireProviderSession({ children }) {
  const session = useStoredSession("hr_proveedor_session");
  if (!session?.proveedorId || !session?.token)
    return <Navigate to="/login" replace />;
  return children;
}

function RequireAdminSession({ children }) {
  return <RequireAdminAuth>{children}</RequireAdminAuth>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Routes>
        <Route path="/login" element={<ProviderLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <RequireAdminSession>
              <AdminShell />
            </RequireAdminSession>
          }
        />
        <Route
          path="/"
          element={
            <RequireProviderSession>
              <ProviderPortal />
            </RequireProviderSession>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
