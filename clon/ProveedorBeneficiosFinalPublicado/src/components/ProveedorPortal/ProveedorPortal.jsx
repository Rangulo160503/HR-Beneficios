// src/components/ProveedorPortal/ProveedorPortal.jsx
import { useState } from "react";
import ProveedorHeader from "./ProveedorHeader";
import ProveedorSidebar from "./ProveedorSidebar";
import ProveedorMobileSidebar from "./ProveedorMobileSidebar";

// Páginas del portal de proveedor
//import ProveedorBenefitsPage from "../../pages/ProveedorPortal/ProveedorBenefitsPage/ProveedorBenefitsPage";
import ProveedorPerfilPage from "../../components/ProveedorPortal/ProveedorPerfilPage/ProveedorPerfilPage";
//import ProveedorAyudaPage from "../../pages/ProveedorPortal/ProveedorAyudaPage/ProveedorAyudaPage";

export default function ProveedorPortal() {
  const [activeSection, setActiveSection] = useState("beneficios");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleChangeSection = (key) => setActiveSection(key);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER PRINCIPAL (top bar) */}
      <ProveedorHeader
        nav={activeSection}
        collapsed={collapsed}
        onToggleCollapsed={setCollapsed}
        setShowMobileNav={setShowMobileNav}
      />

      <div className="flex">
        {/* SIDEBAR DESKTOP */}
        <ProveedorSidebar
          activeSection={activeSection}
          onChangeSection={handleChangeSection}
          collapsed={collapsed}
          onToggleCollapsed={setCollapsed}
        />

        {/* CONTENIDO */}
        <main className="flex-1 p-4">
          {activeSection === "perfil" && <ProveedorPerfilPage />}
        </main>
      </div>

      {/* SIDEBAR MÓVIL */}
      <ProveedorMobileSidebar
        open={showMobileNav}
        current={activeSection}
        onSelect={handleChangeSection}
        onClose={() => setShowMobileNav(false)}
      />
    </div>
  );
}
