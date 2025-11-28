// src/components/AdminShell/AdminShell.jsx
import Sidebar from "../sidebar/Sidebar";
import MobileSidebar from "../sidebar/MobileSidebar";
import AdminHeader from "./AdminHeader";
import AdminMain from "./AdminMain";
import useAdminShell from "./useAdminShell";
import { MOBILE_ITEMS, NAV_ITEMS } from "./constants";

export default function AdminShell() {
  const {
    nav,
    setNav,
    collapsed,
    setCollapsed,
    showMobileNav,
    setShowMobileNav,
    beneficiosState,
    beneficios,
    accionesBeneficios,
    cats,
    provs,
    addCategoria,
    addProveedor,
    showForm,
    setShowForm,
    editing,
    setEditing,
  } = useAdminShell();

  const handleSelectNav = (key) => {
    if (key === NAV_ITEMS.HRPORTAL) {
      window.open("http://hrportal", "_blank", "noopener,noreferrer");
      return;
    }
    setNav(key);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      {/* Sidebar escritorio */}
      <Sidebar
        nav={nav}
        onChangeNav={handleSelectNav}
        collapsed={collapsed}
        onToggleCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col">
        {/* Header superior */}
        <AdminHeader
          nav={nav}
          onOpenMobile={() => setShowMobileNav(true)}
        />

        {/* Contenido principal */}
        <AdminMain
          nav={nav}
          // beneficios
          state={beneficiosState}
          beneficios={beneficios}
          accionesBeneficios={accionesBeneficios}
          // catálogos
          cats={cats}
          provs={provs}
          addCategoria={addCategoria}
          addProveedor={addProveedor}
          // formulario
          showForm={showForm}
          setShowForm={setShowForm}
          editing={editing}
          setEditing={setEditing}
        />

        {/* Sidebar móvil */}
        <MobileSidebar
          open={showMobileNav}
          current={nav}
          items={MOBILE_ITEMS}
          onSelect={handleSelectNav}
          onClose={() => setShowMobileNav(false)}
        />
      </div>
    </div>
  );
}
