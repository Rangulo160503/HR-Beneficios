// src/services/api.js
const CLOUD = "https://hr-beneficios-api-xxxx.canadacentral-01.azurewebsites.net";
const LOCAL  = "https://localhost:5001";

// 🔀 cambia esto a "local" mientras Azure esté en quota exceeded
const TARGET = "local"; // "cloud" | "local"

const API_BASE = (TARGET === "cloud" ? CLOUD : LOCAL).replace(/\/$/, "");
console.log("[API_BASE]", API_BASE);

// --- tu httpGet de siempre (mejor con logs para depurar) ---
async function httpGet(path) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" }, mode: "cors" });
  const ct = res.headers.get("content-type") || "";

  if (res.status === 204) return [];
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("HTTP GET error:", { url, status: res.status, statusText: res.statusText, body });
    throw new Error(`${res.status} ${res.statusText} – ${body}`);
  }
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
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    mode: "cors",
  });
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} – ${await res.text()}`);
  return ct.includes("application/json") ? res.json() : res.text();
}

async function httpPut(path, body) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    mode: "cors",
  });
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} – ${await res.text()}`);
  return ct.includes("application/json") ? res.json() : res.text();
}

async function httpDelete(path) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { method: "DELETE", headers: { Accept: "application/json" }, mode: "cors" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} – ${await res.text()}`);
  return null;
}

export const Api = {
  // === Beneficios ===
  beneficios: {
    listar: () => httpGet(EP.beneficios()),
    obtener: (id) => httpGet(EP.beneficioId(id)),
    agregar: (payload) => httpPost(EP.beneficios(), payload),
    editar: (id, payload) => httpPut(EP.beneficioId(id), payload),
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