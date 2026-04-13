import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../features/dashboard/Dashboard.jsx";
import AdminLogin from "../auth/AdminLogin.jsx";
import RequireAdminAuth from "../auth/RequireAdminAuth.jsx";

function RequireAdminSession({ children }) {
  return <RequireAdminAuth>{children}</RequireAdminAuth>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <RequireAdminSession>
              <Dashboard />
            </RequireAdminSession>
          }
        />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </div>
  );
}
