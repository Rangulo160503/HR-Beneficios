// src/components/AdminShell/useAdminShell.js
import { useState } from "react";
import { useBeneficios } from "../../hooks/useBeneficios";
import { useCatalogos } from "../../hooks/useCatalogos";
import { NAV_ITEMS } from "./constants";

export default function useAdminShell() {
  const [nav, setNav] = useState(NAV_ITEMS.BENEFICIOS);
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Beneficios
  const { state: beneficiosState, actions: accionesBeneficios } = useBeneficios();
  const beneficios = beneficiosState?.filtered ?? beneficiosState?.items ?? [];

  // Catálogos
const {
  cats,
  provs,
  categoriaEnUso,
  showCategoriaEnUso,
  setCategoriaEnUso,
  setShowCategoriaEnUso,

  addCategoria,
  renameCategoria,
  deleteCategoria,

  addProveedor,
  renameProveedor,
  deleteProveedor,

  upsertProveedorLocal,
} = useCatalogos();


  return {
    // navegación y layout
    nav,
    setNav,
    collapsed,
    setCollapsed,
    showMobileNav,
    setShowMobileNav,

    // beneficios
    beneficiosState,
    beneficios,
    accionesBeneficios,

    // catálogos
    cats,
    provs,
    addCategoria,
    addProveedor,
    upsertProveedorLocal,
    categoriaEnUso,
    showCategoriaEnUso,
    setCategoriaEnUso,
    setShowCategoriaEnUso,

    renameCategoria,
    deleteCategoria,
    renameProveedor,
    deleteProveedor,
  };
}
