// src/components/ProveedorPortal/ProveedorPortal.jsx
import { useState } from "react";
import ProveedorSidebar from "./ProveedorSidebar";
import ProveedorHeader from "./ProveedorHeader";
// importa aquí lo que uses para el contenido central (Beneficios, Perfil, Ayuda…)

export default function ProveedorPortal() {
  const [activeSection, setActiveSection] = useState("beneficios"); 
  // valores posibles: "beneficios" | "perfil" | "ayuda"

  const getTitle = () => {
    switch (activeSection) {
      case "perfil":
        return "Perfil";
      case "ayuda":
        return "Ayuda";
      case "beneficios":
      default:
        return "Beneficios";
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <ProveedorSidebar
        activeSection={activeSection}
        onChangeSection={setActiveSection}
      />

      <div className="flex-1 flex flex-col">
        <ProveedorHeader title={getTitle()} />

        {/* Contenido central según la sección */}
        <main className="flex-1 overflow-auto">
          {activeSection === "beneficios" && (
            /* aquí va tu lista de beneficios */
            <div>TODO: Beneficios</div>
          )}
          {activeSection === "perfil" && (
            <div>TODO: Perfil proveedor</div>
          )}
          {activeSection === "ayuda" && (
            <div>TODO: Ayuda / FAQs</div>
          )}
        </main>
      </div>
    </div>
  );
}
