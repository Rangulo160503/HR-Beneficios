// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";

import ProviderLogin from "./pages/ProviderLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Gate from "./components/Gate.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Routes>
        {/* Login proveedor (si aún lo usás) */}
        <Route path="/login" element={<ProviderLogin />} />

        {/* Login admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/*" element={<Gate />} />

        {/* Home decide según sesión */}
        <Route path="/" element={<Gate />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
