// src/services/api.js
const API_BASE = (import.meta.env.VITE_API_BASE || "https://localhost:7141").replace(/\/$/, "");

export const EP = {
  beneficios: "/api/Beneficio",
  beneficiosId: (id) => `/api/Beneficio/${id}`,
  publicados: "/api/Beneficio/publicados",
  categorias: "/api/Categoria",
  categoriaId: (id) => `/api/Categoria/${id}`,
  categoriasCount: "/api/Categoria/count",
};

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", ...(options.headers || {}) },
    mode: "cors",
    ...options,
  });
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} → ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// Generic helpers
export const api = {
  get: (path, opts) => request(path, { method: "GET", ...opts }),
  post: (path, body, opts) => request(path, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" }, ...opts }),
  put: (path, body, opts) => request(path, { method: "PUT", body: JSON.stringify(body), headers: { "Content-Type": "application/json" }, ...opts }),
  del: (path, opts) => request(path, { method: "DELETE", ...opts }),
};

// Specifics
export const Beneficios = {
  listar: (opts) => api.get(EP.beneficios, opts),
  publicados: (opts) => api.get(EP.publicados, opts),
  obtener: (id, opts) => api.get(EP.beneficiosId(id), opts),
  crear: (payload, opts) => api.post(EP.beneficios, payload, opts),
  editar: (id, payload, opts) => api.put(EP.beneficiosId(id), payload, opts),
  eliminar: (id, opts) => api.del(EP.beneficiosId(id), opts),
};

export const Categorias = {
  listar: (opts) => api.get(EP.categorias, opts),
  contar: (opts) => api.get(EP.categoriasCount, opts),
  crear: (payload, opts) => api.post(EP.categorias, payload, opts),
  editar: (id, payload, opts) => api.put(EP.categoriaId(id), payload, opts),
  eliminar: (id, opts) => api.del(EP.categoriaId(id), opts),
};

export { API_BASE };
