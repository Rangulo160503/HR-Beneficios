// src/services/api.js

// Selección de entorno
const target = import.meta.env.VITE_API_TARGET?.trim().toLowerCase() || "local";
const API_BASE = (
  target === "local"
    ? import.meta.env.VITE_API_BASE
    : import.meta.env.VITE_API_BASE_CLOUD
)?.replace(/\/$/, "") || "";

// ===============================
// 🔐 TOKEN desde URL (?token=...)
// ===============================
const LS_TOKEN_KEY = "hr_prov_token";

function getToken() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("token");
    if (fromUrl) {
      localStorage.setItem(LS_TOKEN_KEY, fromUrl);
      return fromUrl;
    }
    return localStorage.getItem(LS_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function http(method, path, { json } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(json ? { "Content-Type": "application/json" } : {}),
    body: json ? JSON.stringify(json) : undefined,
    mode: "cors",
  });

  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {}
    throw new Error(`${method} ${path} → ${res.status} ${res.statusText} ${body}`);
  }

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

/*
  Si tu backend NO usa Bearer para ese token (badge hash),
  cambia SOLO esta línea en authHeaders:

  ...(token ? { Authorization: `Bearer ${token}` } : {}),

  por:

  ...(token ? { "X-Token": token } : {}),
*/
