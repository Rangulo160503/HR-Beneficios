// src/services/adminApi.js
import { adminSessionStore } from "../core-config/sessionStores";
import { API_BASE } from "./apiBase";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function authHeader() {
  const auth = adminSessionStore.getSession();
  if (!auth?.access_token) return {};

  const expiresAt = Number(auth.expires_at);
  if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
    adminSessionStore.clearSession();
    return {};
  }

  const type = auth.token_type || "Bearer";
  return { Authorization: `${type} ${auth.access_token}`.trim() };
}

function handleUnauthorized() {
  adminSessionStore.clearSession();
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

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message = payload?.message || `${method} ${path} → ${res.status}`;
    throw new ApiError(message, res.status, payload);
  }

  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? payload : payload;
}

export const BeneficioApi = {
  list:  (o={}) => req("/api/Beneficio", o),
  get:   (id,o={}) => req(`/api/Beneficio/${id}`, o),
  create: (dto, o = {}) => {
  // soporta ambas formas:
  // 1) BeneficioApi.create(dto, { proveedorId, token })
  // 2) BeneficioApi.create(dto, { badge: { proveedorId, token } })
  const proveedorId = o?.proveedorId ?? o?.badge?.proveedorId;
  const token = o?.token ?? o?.badge?.token;

  const params = new URLSearchParams();
  if (proveedorId) params.set("proveedorId", proveedorId);
  if (token) params.set("token", token);

  const path = params.toString()
    ? `/api/Beneficio?${params.toString()}`
    : "/api/Beneficio";

  // importante: NO mandamos proveedorId/token en headers/body,
  // porque el backend los espera por query.
  const { proveedorId: _p, token: _t, badge: _b, ...rest } = o;

  return req(path, { method: "POST", json: dto, ...rest });
},
  update:(id,dto,o={}) => req(`/api/Beneficio/${id}`, { method:"PUT", json:dto, ...o }),
  remove:(id,o={}) => req(`/api/Beneficio/${id}`, { method:"DELETE", ...o }),
  listByCategoria: (categoriaId, page = 1, pageSize = 50, search = "", o = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (search) params.set("search", search);
    return req(`/api/Beneficio/por-categoria/${categoriaId}?${params.toString()}`, o);
  },
  reassignCategoria: (body, o = {}) =>
    req(`/api/Beneficio/reasignar-categoria`, { method: "PUT", json: body, ...o }),
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

export const InfoBoardApi = {
  list: ({ activo, search, q } = {}, o = {}) => {
    const params = new URLSearchParams();
    const hasActivo = activo !== undefined && activo !== null && activo !== "";
    if (hasActivo) params.set("activo", String(activo));
    const searchTerm = (search ?? q)?.toString().trim();
    if (searchTerm) {
      params.set("search", searchTerm);
      params.set("q", searchTerm);
    }
    const qs = params.toString();
    return req(`/api/InfoBoard${qs ? `?${qs}` : ""}`, o);
  },
  get: (id, o = {}) => req(`/api/InfoBoard/${id}`, o),
  create: (dto, o = {}) => req(`/api/InfoBoard`, { method: "POST", json: dto, ...o }),
  update: (id, dto, o = {}) => req(`/api/InfoBoard/${id}`, { method: "PUT", json: dto, ...o }),
  remove: (id, o = {}) => req(`/api/InfoBoard/${id}`, { method: "DELETE", ...o }),
};
