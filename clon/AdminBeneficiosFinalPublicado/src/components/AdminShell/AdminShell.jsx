// src/components/AdminShell/AdminShell.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import MobileSidebar from "../sidebar/MobileSidebar";
import AdminHeader from "./AdminHeader";
import AdminMain from "./AdminMain";
import useAdminShell from "./useAdminShell";
import { MOBILE_ITEMS, NAV_ITEMS } from "./constants";

export default function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();
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
    upsertProveedorLocal,
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

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/admin/infoboard")) setNav(NAV_ITEMS.INFOBOARD);
    else if (path.includes("/admin/categorias")) setNav(NAV_ITEMS.CATEGORIAS);
    else if (path.includes("/admin/proveedores")) setNav(NAV_ITEMS.PROVEEDORES);
    else if (path.includes("/admin/aprobaciones")) setNav(NAV_ITEMS.APROBACIONES);
    else if (!path.includes("/admin")) setNav(NAV_ITEMS.BENEFICIOS);
    else setNav((prev) => prev || NAV_ITEMS.BENEFICIOS);
  }, [location.pathname, setNav]);

  useEffect(() => {
    const nextPath =
      nav === NAV_ITEMS.INFOBOARD
        ? "/admin/infoboard"
        : nav === NAV_ITEMS.CATEGORIAS
          ? "/admin/categorias"
          : nav === NAV_ITEMS.PROVEEDORES
            ? "/admin/proveedores"
            : nav === NAV_ITEMS.APROBACIONES
              ? "/admin/aprobaciones"
              : "/admin";

    if (location.pathname !== nextPath) {
      navigate(nextPath, { replace: true });
    }
  }, [nav, navigate, location.pathname]);

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
          upsertProveedorLocal={upsertProveedorLocal}
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
