// src/services/api.js
const API_BASE = (import.meta.env.VITE_API_BASE
  || "https://hr-beneficios-api-grgmckc5dwdca9dc.canadacentral-01.azurewebsites.net").replace(/\/$/, "");

async function httpGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    mode: "cors",
  });
  if (res.status === 204) return []; // NoContent -> lista vacía
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const EP = {
  beneficios: () => `/api/Beneficio`,
  beneficioId: (id) => `/api/Beneficio/${id}`,
  categorias: () => `/api/Categoria`,
  categoriaId: (id) => `/api/Categoria/${id}`,
  proveedores: () => `/api/Proveedor`,
  proveedorId: (id) => `/api/Proveedor/${id}`,
};

export const Api = {
  beneficios: {
    listar: () => httpGet(EP.beneficios()),
    obtener: (id) => httpGet(EP.beneficioId(id)),
  },
  categorias: {
    listar: () => httpGet(EP.categorias()),
    obtener: (id) => httpGet(EP.categoriaId(id)),
  },
  proveedores: {
    listar: () => httpGet(EP.proveedores()),
    obtener: (id) => httpGet(EP.proveedorId(id)),
  },
};
