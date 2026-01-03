// src/services/api.js

// Selección de entorno
const target = import.meta.env.VITE_API_TARGET?.trim().toLowerCase() || "local";
const API_BASE = (
  target === "cloud"
    ? import.meta.env.VITE_API_BASE_CLOUD
    : import.meta.env.VITE_API_BASE
)?.replace(/\/$/, "") || "";

async function http(method, path, { json } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(json ? { "Content-Type": "application/json" } : {}),
    },
    body: json ? JSON.stringify(json) : undefined,
    mode: "cors",
  });

  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

const httpGet = (path) => http("GET", path);
const httpPost = (path, json) => http("POST", path, { json });
const httpPut = (path, json) => http("PUT", path, { json });

export const Api = {
  beneficios: {
    aprobacionesPendientes: () => httpGet(`/api/Beneficio/aprobaciones/pendientes`),
    aprobacionesAprobados: () => httpGet(`/api/Beneficio/aprobaciones/aprobados`),
    aprobar: (id) => httpPost(`/api/Beneficio/${id}/aprobar`, {}),
    rechazar: (id) => httpPost(`/api/Beneficio/${id}/rechazar`, {}),
    cambiarDisponible: (id, disponible) =>
      httpPut(`/api/Beneficio/${id}/disponible`, { disponible }),
    obtener: (id) => httpGet(`/api/Beneficio/${id}`),
    editar: (id, payload) => httpPut(`/api/Beneficio/${id}`, payload),
  },
};

console.log(`🌍 API activa: ${target.toUpperCase()} → ${API_BASE}`);