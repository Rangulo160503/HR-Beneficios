import { useState } from "react";
import ProveedorHeader from "./ProveedorHeader";
import ProveedorSidebar from "./ProveedorSidebar";
import ProveedorMobileSidebar from "./ProveedorMobileSidebar";
import ProveedorBenefitsList from "./ProveedorBenefitsList";

export default function ProveedorPortal() {
  const [activeSection, setActiveSection] = useState("beneficios");
  const [showMobileNav, setShowMobileNav] = useState(false);

  const handleChangeSection = (key) => {
    setActiveSection(key);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* header arriba */}
      <ProveedorHeader
        nav={activeSection}
        setShowMobileNav={setShowMobileNav}
      />

      <div className="flex">
        {/* sidebar desktop */}
        <ProveedorSidebar
          activeSection={activeSection}
          onChangeSection={handleChangeSection}
        />

        {/* contenido */}
        <main className="flex-1 p-4">
          {activeSection === "beneficios" && <ProveedorBenefitsList />}
          {activeSection === "perfil" && <div>TODO: Perfil proveedor</div>}
          {activeSection === "ayuda" && <div>TODO: Ayuda / FAQs</div>}
        </main>
      </div>

      {/* sidebar móvil estilo admin */}
      <ProveedorMobileSidebar
        open={showMobileNav}
        current={activeSection}
        onSelect={handleChangeSection}
        onClose={() => setShowMobileNav(false)}
      />
    </div>
  );
}
