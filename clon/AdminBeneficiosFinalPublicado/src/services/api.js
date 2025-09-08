// src/services/api.js (ADMIN)
const API_BASE = (import.meta.env.VITE_API_BASE
  || "https://hr-beneficios-api-grgmckc5dwdca9dc.canadacentral-01.azurewebsites.net"
).replace(/\/$/, "");

// -----------------------
// HTTP helpers
// -----------------------
async function http(method, path, body, extra = {}) {
  const init = {
    method,
    mode: "cors",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(extra.headers || {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...extra,
  };

  const res = await fetch(`${API_BASE}${path}`, init);

  if (res.status === 204) return null; // NoContent → vacío

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${path} → ${res.status} ${res.statusText}${text ? ` • ${text}` : ""}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

const httpGet    = (p, e) => http("GET",    p, null, e);
const httpPost   = (p, b, e) => http("POST",  p, b, e);
const httpPut    = (p, b, e) => http("PUT",   p, b, e);
const httpDelete = (p, e) => http("DELETE", p, null, e);

// -----------------------
// Endpoints
// -----------------------
export const EP = {
  // Beneficios
  beneficios:  () => `/api/Beneficio`,
  beneficioId: (id) => `/api/Beneficio/${id}`,

  // Categorías
  categorias:  () => `/api/Categoria`,
  categoriaId: (id) => `/api/Categoria/${id}`,

  // Proveedores
  proveedores: () => `/api/Proveedor`,
  proveedorId: (id) => `/api/Proveedor/${id}`,
};

// -----------------------
// API agrupada (ADMIN)
// -----------------------
export const Api = {
  beneficios: {
    listar:   (opts)       => httpGet(EP.beneficios(), opts),
    obtener:  (id, opts)   => httpGet(EP.beneficioId(id), opts),
    crear:    (payload,o)  => httpPost(EP.beneficios(), payload, o),
    editar:   (id, p, o)   => httpPut(EP.beneficioId(id), p, o),
    eliminar: (id, o)      => httpDelete(EP.beneficioId(id), o),
  },
  categorias: {
    listar:   (opts)       => httpGet(EP.categorias(), opts),
    obtener:  (id, opts)   => httpGet(EP.categoriaId(id), opts),
    crear:    (payload,o)  => httpPost(EP.categorias(), payload, o),
    editar:   (id, p, o)   => httpPut(EP.categoriaId(id), p, o),
    eliminar: (id, o)      => httpDelete(EP.categoriaId(id), o),
  },
  proveedores: {
    listar:   (opts)       => httpGet(EP.proveedores(), opts),
    obtener:  (id, opts)   => httpGet(EP.proveedorId(id), opts),
    crear:    (payload,o)  => httpPost(EP.proveedores(), payload, o),
    editar:   (id, p, o)   => httpPut(EP.proveedorId(id), p, o),
    eliminar: (id, o)      => httpDelete(EP.proveedorId(id), o),
  },
};

export { API_BASE };
