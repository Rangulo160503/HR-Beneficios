// src/App.jsx
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useMemo } from "react";

import AdminShell from "./components/AdminShell/AdminShell.jsx";
import ProviderPortal from "./pages/ProviderPortal.jsx";
import ProviderLogin from "./pages/ProviderLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
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

function RequireAdminSession({ children }) {
  return <RequireAdminAuth>{children}</RequireAdminAuth>;
}

// ✅ La ruta "/" decide qué hacer (sin redirects escondidos en un guard)
function ProviderGate() {
  const session = useStoredSession("hr_proveedor_session");

  // Si NO hay sesión de proveedor, mandamos a admin login (como querés)
  if (!session?.proveedorId || !session?.token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <ProviderPortal />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Routes>
        {/* Login proveedor (si aún lo usás) */}
        <Route path="/login" element={<ProviderLogin />} />

        {/* Login admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin protegido */}
        <Route
          path="/admin/*"
          element={
            <RequireAdminSession>
              <AdminShell />
            </RequireAdminSession>
          }
        />

        {/* Home decide según sesión */}
        <Route path="/" element={<ProviderGate />} />

        {/* ✅ Se mantiene como pediste */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
