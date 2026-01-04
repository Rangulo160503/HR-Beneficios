// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";

import AdminShell from "./components/AdminShell/AdminShell.jsx";
import ProviderLogin from "./pages/ProviderLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import RequireAdminAuth from "./routes/RequireAdminAuth.jsx";

function RequireAdminSession({ children }) {
  return <RequireAdminAuth>{children}</RequireAdminAuth>;
}

function RootGate() {
  return <Navigate to="/admin" replace />;
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
        <Route
          path="/"
          element={
            <RequireAdminSession>
              <RootGate />
            </RequireAdminSession>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
