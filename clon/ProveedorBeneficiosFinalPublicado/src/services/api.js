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
  // === Beneficios ===
  beneficios: () => `/api/Beneficio`,
  beneficioId: (id) => `/api/Beneficio/${id}`,

  // Filtrado por proveedor (lo usamos para la vista del dashboard)
  beneficiosPorProveedor: (proveedorId) => `/api/Beneficio/por-proveedor/${proveedorId}`,

  // === Imágenes del beneficio ===
  beneficioImagenPorBeneficio: (beneficioId) => `/api/BeneficioImagen/${beneficioId}`,
  beneficioImagenDetalle: (imagenId) => `/api/BeneficioImagen/detalle/${imagenId}`,
  beneficioImagenId: (imagenId) => `/api/BeneficioImagen/${imagenId}`,

  // === Catálogos de apoyo ===
  categorias: () => `/api/Categoria`,
  categoriaId: (id) => `/api/Categoria/${id}`,
  productos: () => `/api/Producto`,
  productoId: (id) => `/api/Producto/${id}`,
  servicios: () => `/api/Servicio`,
  servicioId: (id) => `/api/Servicio/${id}`,
  ubicaciones: () => `/api/Ubicacion`,
  ubicacionId: (id) => `/api/Ubicacion/${id}`,

  // === Proveedores ===
  proveedores: () => `/api/Proveedor`,
  proveedorId: (id) => `/api/Proveedor/${id}`,
};

// === Funciones HTTP auxiliares ===
async function httpPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    mode: "cors",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

async function httpPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    mode: "cors",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

async function httpDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    mode: "cors",
  });
  if (!res.ok && res.status !== 204) throw new Error(`${res.status} ${res.statusText}`);
  return true;
}

export const Api = {
  // === Beneficios ===
  beneficios: {
    listar: () => httpGet(EP.beneficios()),
    obtener: (id) => httpGet(EP.beneficioId(id)),
    crear: (body) => httpPost(EP.beneficios(), body),
    editar: (id, body) => httpPut(EP.beneficioId(id), body),
    eliminar: (id) => httpDelete(EP.beneficioId(id)),

    // Trae todos y filtra en el front por proveedor (usado en dashboard)
    listarPorProveedorFront: async (proveedorId) => {
      const all = await httpGet(EP.beneficios());
      return (all || []).filter(x => x.proveedorId === proveedorId);
    },

    // (para cuando crees el endpoint en backend)
    listarPorProveedorAPI: (proveedorId) => httpGet(EP.beneficiosPorProveedor(proveedorId)),
  },

  // === Imágenes de beneficio ===
  imagenes: {
    listarPorBeneficio: (beneficioId) => httpGet(EP.beneficioImagenPorBeneficio(beneficioId)),
    detalle: (imagenId) => httpGet(EP.beneficioImagenDetalle(imagenId)),
    crear: (body) => httpPost(EP.beneficioImagenId(""), body),
    editar: (imagenId, body) => httpPut(EP.beneficioImagenId(imagenId), body),
    eliminar: (imagenId) => httpDelete(EP.beneficioImagenId(imagenId)),
  },

  // === Catálogos ===
  categorias: {
    listar: () => httpGet(EP.categorias()),
    obtener: (id) => httpGet(EP.categoriaId(id)),
  },
  productos: {
    listar: () => httpGet(EP.productos()),
    obtener: (id) => httpGet(EP.productoId(id)),
  },
  servicios: {
    listar: () => httpGet(EP.servicios()),
    obtener: (id) => httpGet(EP.servicioId(id)),
  },
  ubicaciones: {
    listar: () => httpGet(EP.ubicaciones()),
    obtener: (id) => httpGet(EP.ubicacionId(id)),
  },

  // === Proveedores ===
  proveedores: {
    listar: () => httpGet(EP.proveedores()),
    obtener: (id) => httpGet(EP.proveedorId(id)),
  },
};