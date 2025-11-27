import { useState } from "react";
import { useBeneficios } from "@/hooks/useBeneficios";
import { useCatalogos } from "@/hooks/useCatalogos";
import { NAV_ITEMS } from "./constants";

export default function useAdminShell() {
  const [nav, setNav] = useState(NAV_ITEMS.BENEFICIOS);
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // BENEFICIOS
  const { state, actions } = useBeneficios();
  const beneficios = state.filtered ?? state.items ?? [];

  // CATEGORÍAS Y PROVEEDORES
  const {
    cats,
    provs,
    addCategoria,
    addProveedor,
  } = useCatalogos();

  return {
    // navegación / layout
    nav,
    setNav,
    collapsed,
    setCollapsed,
    showMobileNav,
    setShowMobileNav,

    // beneficios
    state,
    accionesBeneficios: actions,
    beneficios,

    // catálogos
    cats,
    provs,
    addCategoria,
    addProveedor,

    // formulario
    showForm,
    setShowForm,
    editing,
    setEditing,
  };
}
