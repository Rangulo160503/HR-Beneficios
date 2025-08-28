// src/services/beneficiosService.js
const API_BASE = (import.meta.env.VITE_API_BASE || "https://localhost:7141").replace(/\/$/, "");

// Endpoints
export const EP = {
  publicados: "/api/Beneficio/publicados",         // ← lista (grid)
  beneficioId: (id) => `/api/Beneficio/${id}`,     // ← detalle (modal)
};

// Request helper
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
};

// Específicos
export const fetchBeneficios = (opts) => api.get(EP.publicados, opts); // ← usado por Display.jsx

export const Beneficios = {
  obtener: (id, opts) => api.get(EP.beneficioId(id), opts),            // ← usado por BenefitDetailModal.jsx
};

export { API_BASE };
