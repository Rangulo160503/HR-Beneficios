// src/services/adminApi.js
import { clearAuth, getAuth } from "../utils/adminAuth";
import { API_BASE } from "./apiBase";

export function authHeader() {
  const auth = getAuth();
  if (!auth?.access_token) return {};

  const expiresAt = Number(auth.expires_at);
  if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
    clearAuth();
    return {};
  }

  const type = auth.token_type || "Bearer";
  return { Authorization: `${type} ${auth.access_token}`.trim() };
}

function handleUnauthorized() {
  clearAuth();
  if (typeof window !== "undefined") {
    window.location.replace("/admin/login");
  }
}

async function req(path, { method = "GET", json, headers, signal } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...authHeader(),
      ...headers,
    },
    body: json ? JSON.stringify(json) : undefined,
    signal,
    mode: "cors",
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("unauthorized");
  }

  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const BeneficioApi = {
  list:  (o={}) => req("/api/Beneficio", o),
  get:   (id,o={}) => req(`/api/Beneficio/${id}`, o),
  create:(dto,o={}) => req("/api/Beneficio", { method:"POST", json:dto, ...o }),
  update:(id,dto,o={}) => req(`/api/Beneficio/${id}`, { method:"PUT", json:dto, ...o }),
  remove:(id,o={}) => req(`/api/Beneficio/${id}`, { method:"DELETE", ...o }),
  pending: (o={}) => req("/api/Beneficio/pendientes", o),
  approve: (id,o={}) => req(`/api/Beneficio/${id}/aprobar`, { method:"PUT", json:{}, ...o }),
  reject:  (id,body={},o={}) => req(`/api/Beneficio/${id}/rechazar`, { method:"PUT", json:body, ...o }),
};

// src/services/adminApi.js
export const CategoriaApi = {
  list:  (o={}) => req("/api/Categoria", o),
  get:   (id,o={}) => req(`/api/Categoria/${id}`, o),
  create:(dto,o={}) => req("/api/Categoria", { method: "POST", json: dto, ...o }), // usa { nombre } (y opcionalmente { activa })
  update:(id,dto,o={}) => req(`/api/Categoria/${id}`, { method:"PUT", json:dto, ...o }),
  remove:(id,o={}) => req(`/api/Categoria/${id}`, { method:"DELETE", ...o }),
};


export const ProveedorApi = {
  list:  (o={}) => req("/api/Proveedor", o),
  get:   (id,o={}) => req(`/api/Proveedor/${id}`, o),
  create:(dto,o={}) => req("/api/Proveedor", { method:"POST", json:dto, ...o }),   // usa { nombre }
  update:(id,dto,o={}) => req(`/api/Proveedor/${id}`, { method:"PUT", json:dto, ...o }),
  remove:(id,o={}) => req(`/api/Proveedor/${id}`, { method:"DELETE", ...o }),
};



export const BeneficioImagenApi = {
  list:  (beneficioId, o={}) => req(`/api/BeneficioImagen/${beneficioId}`, o),
  get:   (id,o={}) => req(`/api/BeneficioImagen/detalle/${id}`, o),
  create:(dto,o={}) => req(`/api/BeneficioImagen`, { method:"POST", json:dto, ...o }),
  update:(id,dto,o={}) => req(`/api/BeneficioImagen/${id}`, { method:"PUT", json:dto, ...o }),
  remove:(id,o={}) => req(`/api/BeneficioImagen/${id}`, { method:"DELETE", ...o }),
};

export const ToqueBeneficioApi = {
  analytics: (beneficioId, range = "1W", o = {}, granularity) => {
    const params = new URLSearchParams({ range });
    if (granularity) params.set("granularity", granularity);
    return req(`/api/ToqueBeneficio/analytics/${beneficioId}?${params.toString()}`, o);
  },
  resumen: (range = "1W", o = {}) =>
    req(`/api/ToqueBeneficio/resumen?range=${range}`, o),
  registrar: (beneficioId, origen, o = {}) =>
    req(`/api/ToqueBeneficio`, {
      method: "POST",
      json: { beneficioId, origen },
      ...o,
    }),
};
