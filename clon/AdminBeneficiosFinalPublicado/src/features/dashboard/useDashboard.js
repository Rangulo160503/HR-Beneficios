import { useState } from "react";
import { useBeneficios } from "../beneficios/hooks/useBeneficios";
import { useCatalogos } from "../../shared/hooks/useCatalogos";
import { NAV_ITEMS } from "./constants";
export default function useDashboard() {
  const [nav, setNav] = useState(NAV_ITEMS.BENEFICIOS);
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const {
    state: beneficiosState,
    actions: accionesBeneficios
  } = useBeneficios();
  const beneficios = beneficiosState?.filtered ?? beneficiosState?.items ?? [];
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
    upsertProveedorLocal
  } = useCatalogos();
  return {
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
    categoriaEnUso,
    showCategoriaEnUso,
    setCategoriaEnUso,
    setShowCategoriaEnUso,
    showForm,
    setShowForm,
    editing,
    setEditing,
    renameCategoria,
    deleteCategoria,
    renameProveedor,
    deleteProveedor
  };
}
