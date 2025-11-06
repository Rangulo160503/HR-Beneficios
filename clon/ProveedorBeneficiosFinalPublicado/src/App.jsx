import { Routes, Route, Navigate } from "react-router-dom";
import ProviderDashboard from "./views/proveedor/ProviderDashboard.jsx";
import BeneficioDetalle from "./views/proveedor/BeneficioDetalle.jsx";
import BeneficioForm from "./views/proveedor/BeneficioForm.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/beneficios" replace />} />
      <Route path="/beneficios" element={<ProviderDashboard />} />
      <Route path="/beneficios/:id" element={<BeneficioDetalle />} />
      <Route path="/beneficios/nuevo" element={<BeneficioForm mode="create" />} />
      <Route path="/beneficios/:id/editar" element={<BeneficioForm mode="edit" />} />
    </Routes>
  );
}
