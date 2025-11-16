// src/services/api.js

// 🧭 Selección dinámica del entorno
const target = import.meta.env.VITE_API_TARGET?.trim().toLowerCase() || "local";

const API_BASE = (
  target === "cloud"
    ? import.meta.env.VITE_API_BASE_CLOUD
    : import.meta.env.VITE_API_BASE
).replace(/\/$/, "");

// 📡 Función GET genérica
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

// 🧱 Endpoints centralizados
export const EP = {
  beneficios:      ()    => `/api/Beneficio`,
  beneficioId:     (id)  => `/api/Beneficio/${id}`,

  categorias:      ()    => `/api/Categoria`,
  categoriaId:     (id)  => `/api/Categoria/${id}`,

  proveedores:     ()    => `/api/Proveedor`,
  proveedorId:     (id)  => `/api/Proveedor/${id}`,

  // 👇 NUEVO: imágenes de un beneficio
  beneficioImagenPorBeneficio: (beneficioId) =>
    `/api/BeneficioImagen/${beneficioId}`,
  // si algún día ocupas el detalle de 1 imagen:
  // beneficioImagenDetalle: (imagenId) => `/api/BeneficioImagen/detalle/${imagenId}`,
};

// 🚀 API agrupada por recurso
export const Api = {
  beneficios: {
    listar:  ()   => httpGet(EP.beneficios()),
    obtener: (id) => httpGet(EP.beneficioId(id)),
  },
  categorias: {
    listar:  ()   => httpGet(EP.categorias()),
    obtener: (id) => httpGet(EP.categoriaId(id)),
  },
  proveedores: {
    listar:  ()   => httpGet(EP.proveedores()),
    obtener: (id) => httpGet(EP.proveedorId(id)),
  },

  // 👇 NUEVO: módulo para las imágenes de beneficio
  beneficioImagen: {
    // esto es lo que vas a usar en el modal:
    obtenerPorBeneficio: (beneficioId) =>
      httpGet(EP.beneficioImagenPorBeneficio(beneficioId)),
    // si luego quieres detalle por imagenId:
    // obtenerDetalle: (imagenId) => httpGet(EP.beneficioImagenDetalle(imagenId)),
  },
};

// 🧾 Log de entorno activo
console.log(`🌍 API activa: ${target.toUpperCase()} → ${API_BASE}`);
