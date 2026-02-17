// src/services/api.js
const CLOUD = "https://hr-beneficios-api-grgmckc5dwdca9dc.canadacentral-01.azurewebsites.net";
const LOCAL  = "https://localhost:5001";

// 🔀 cambia esto a "local" mientras Azure esté en quota exceeded
const TARGET = "cloud"; // "cloud" | "local"

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
  beneficiosPendientes: () => `/api/Beneficio/pendientes`,
  beneficiosRechazados: () => `/api/Beneficio/rechazados`,
  beneficioId: (id) => `/api/Beneficio/${id}`,
  aprobacionesPendientes: () => `/api/Beneficio/aprobaciones/pendientes`,
  aprobacionesAprobados: () => `/api/Beneficio/aprobaciones/aprobados`,
  beneficioAprobar: (id) => `/api/Beneficio/${id}/aprobar`,
  beneficioRechazar: (id) => `/api/Beneficio/${id}/rechazar`,
  beneficioDisponible: (id) => `/api/Beneficio/${id}/disponible`,

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
  // === Beneficios ===
beneficios: {
  listar: () => httpGet(EP.beneficios()),
  obtener: (id) => httpGet(EP.beneficioId(id)),
  pendientes: () => httpGet(EP.beneficiosPendientes()),
  rechazados: () => httpGet(EP.beneficiosRechazados()),
  agregar: (payload) => {
  const params = new URLSearchParams(window.location.search);
  const proveedorId = params.get("proveedorId");
  const token = params.get("token");

  if (!proveedorId || !token) {
    throw new Error("No hay proveedorId o token en la URL");
  }

  return httpPost(
    `${EP.beneficios()}?proveedorId=${proveedorId}&token=${token}`,
    payload
  );
},
  editar: (id, payload) => httpPut(EP.beneficioId(id), payload),
  eliminar: (id) => httpDelete(EP.beneficioId(id)),

  aprobacionesPendientes: () => httpGet(EP.aprobacionesPendientes()),
  aprobacionesAprobados: () => httpGet(EP.aprobacionesAprobados()),
  aprobar: (id) => httpPost(EP.beneficioAprobar(id), {}),
  rechazar: (id) => httpPost(EP.beneficioRechazar(id), {}),
  cambiarDisponible: (id, disponible) =>
    httpPut(EP.beneficioDisponible(id), { disponible }),

  // Trae todos y filtra en el front por proveedor (usado en dashboard / portal proveedor)
  listarPorProveedorFront: async (proveedorId) => {
  const [aprobados, pendientes, rechazados] = await Promise.all([
    httpGet(EP.beneficios()),
    httpGet(EP.beneficiosPendientes()),
    httpGet(EP.beneficiosRechazados()),
  ]);

  const all = [...(aprobados || []), ...(pendientes || []), ...(rechazados || [])];
  console.log("[Api] beneficios (ALL):", all);

  const norm = (v) => String(v || "").toLowerCase();

  const filtrados = (all || []).filter((x) => {
    const idModelo = x.proveedorId ?? x.ProveedorId;
    return norm(idModelo) === norm(proveedorId);
  });

  console.log("[Api] beneficios filtrados por proveedor:", filtrados);
  return filtrados;
},


  // (para cuando crees el endpoint en backend)
  listarPorProveedorAPI: (proveedorId) =>
    httpGet(EP.beneficiosPorProveedor(proveedorId)),
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
    agregar: (payload) => httpPost(EP.proveedores(), payload),
    editar: (id, payload) => httpPut(EP.proveedorId(id), payload),
    eliminar: (id) => httpDelete(EP.proveedorId(id)),
    validarLogin: (id) => httpGet(`/api/Proveedor/validar-login/${id}`),
  },

};