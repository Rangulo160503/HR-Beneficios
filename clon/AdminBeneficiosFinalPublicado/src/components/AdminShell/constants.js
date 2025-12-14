// src/components/AdminShell/constants.js
export const NAV_ITEMS = {
  BENEFICIOS: "beneficios",
  CATEGORIAS: "categorias",
  PROVEEDORES: "proveedores",
  INFOBOARD: "infoboard",
  HRPORTAL: "hrportal",
  APROBACIONES: "aprobaciones",
};

export const MOBILE_ITEMS = [
  { key: NAV_ITEMS.BENEFICIOS, label: "Beneficios" },
  { key: NAV_ITEMS.CATEGORIAS, label: "Categorías" },
  { key: NAV_ITEMS.PROVEEDORES, label: "Proveedores" },
  { key: NAV_ITEMS.INFOBOARD, label: "InfoBoard" },
  { key: NAV_ITEMS.HRPORTAL, label: "HR Portal", href: "http://hrportal" },
  { key: NAV_ITEMS.APROBACIONES, label: "Aprobaciones" },
];
