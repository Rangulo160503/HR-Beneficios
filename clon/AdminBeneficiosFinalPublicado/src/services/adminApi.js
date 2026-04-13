import { clearSession, getSession } from "../auth/auth";

const API_TARGET = import.meta.env.VITE_API_TARGET?.trim().toLowerCase() || "local";
const API_BASE =
  (API_TARGET === "cloud" ? import.meta.env.VITE_API_BASE_CLOUD : import.meta.env.VITE_API_BASE)?.replace(/\/+$/, "") ||
  "";

export const getApiBase = () => API_BASE;
export { API_TARGET };

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function authHeader() {
  const session = getSession();
  if (!session?.token) return {};
  return { Authorization: `Bearer ${session.token}`.trim() };
}

function handleUnauthorized() {
  const session = getSession();
  const isMock = session?.token === "mock-token";

  if (isMock) {
    console.warn("401 ignorado en modo mock");
  } else {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.replace("/admin/login");
    }
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
  return payload;
}

function crud(base) {
  return {
    list: (o = {}) => req(base, o),
    get: (id, o = {}) => req(`${base}/${id}`, o),
    create: (dto, o = {}) => req(base, { method: "POST", json: dto, ...o }),
    update: (id, dto, o = {}) => req(`${base}/${id}`, { method: "PUT", json: dto, ...o }),
    remove: (id, o = {}) => req(`${base}/${id}`, { method: "DELETE", ...o }),
  };
}

export const BeneficioApi = {
  ...crud("/api/Beneficio"),
  create: (dto, o = {}) => {
    const proveedorId = o?.proveedorId ?? o?.badge?.proveedorId;
    const token = o?.token ?? o?.badge?.token;
    const params = new URLSearchParams();
    if (proveedorId) params.set("proveedorId", proveedorId);
    if (token) params.set("token", token);
    const path = params.toString() ? `/api/Beneficio?${params.toString()}` : "/api/Beneficio";
    const { proveedorId: _p, token: _t, badge: _b, ...rest } = o;
    return req(path, { method: "POST", json: dto, ...rest });
  },
  listByCategoria: (categoriaId, page = 1, pageSize = 50, search = "", o = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (search) params.set("search", search);
    return req(`/api/Beneficio/por-categoria/${categoriaId}?${params.toString()}`, o);
  },
  reassignCategoria: (body, o = {}) =>
    req("/api/Beneficio/reasignar-categoria", { method: "PUT", json: body, ...o }),
  pending: (o = {}) => req("/api/Beneficio/pendientes", o),
  approve: (id, o = {}) => req(`/api/Beneficio/${id}/aprobar`, { method: "PUT", json: {}, ...o }),
  reject: (id, body = {}, o = {}) =>
    req(`/api/Beneficio/${id}/rechazar`, { method: "PUT", json: body, ...o }),
};

export const CategoriaApi = crud("/api/Categoria");
export const ProveedorApi = crud("/api/Proveedor");

export const BeneficioImagenApi = {
  list: (beneficioId, o = {}) => req(`/api/BeneficioImagen/${beneficioId}`, o),
  get: (id, o = {}) => req(`/api/BeneficioImagen/detalle/${id}`, o),
  create: (dto, o = {}) => req("/api/BeneficioImagen", { method: "POST", json: dto, ...o }),
  update: (id, dto, o = {}) => req(`/api/BeneficioImagen/${id}`, { method: "PUT", json: dto, ...o }),
  remove: (id, o = {}) => req(`/api/BeneficioImagen/${id}`, { method: "DELETE", ...o }),
};

export const ToqueBeneficioApi = {
  analytics: (beneficioId, range = "1W", o = {}, granularity) => {
    const params = new URLSearchParams({ range });
    if (granularity) params.set("granularity", granularity);
    return req(`/api/ToqueBeneficio/analytics/${beneficioId}?${params.toString()}`, o);
  },
  resumen: (range = "1W", o = {}) => req(`/api/ToqueBeneficio/resumen?range=${range}`, o),
  registrar: (beneficioId, origen, o = {}) =>
    req("/api/ToqueBeneficio", { method: "POST", json: { beneficioId, origen }, ...o }),
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
  create: (dto, o = {}) => req("/api/InfoBoard", { method: "POST", json: dto, ...o }),
  update: (id, dto, o = {}) => req(`/api/InfoBoard/${id}`, { method: "PUT", json: dto, ...o }),
  remove: (id, o = {}) => req(`/api/InfoBoard/${id}`, { method: "DELETE", ...o }),
};

export const AprobacionesApi = {
  pendientes: (o = {}) => req("/api/Beneficio/aprobaciones/pendientes", o),
  aprobados: (o = {}) => req("/api/Beneficio/aprobaciones/aprobados", o),
  aprobar: (id, o = {}) => req(`/api/Beneficio/${id}/aprobar`, { method: "POST", json: {}, ...o }),
  rechazar: (id, o = {}) => req(`/api/Beneficio/${id}/rechazar`, { method: "POST", json: {}, ...o }),
  toggleDisponible: (id, disponible, o = {}) =>
    req(`/api/Beneficio/${id}/disponible`, { method: "PUT", json: { disponible }, ...o }),
  obtenerDetalle: (id, o = {}) => req(`/api/Beneficio/${id}`, o),
  editar: (id, payload, o = {}) => req(`/api/Beneficio/${id}`, { method: "PUT", json: payload, ...o }),
};

const ibNorm = v => (typeof v === "string" ? v.trim() : v ?? "");
const ibToBool = v => Boolean(v === true || v === "true" || v === 1 || v === "1");

export function mapInfoBoard(raw) {
  return {
    id: raw?.infoBoardItemId ?? raw?.InfoBoardItemId ?? raw?.id ?? raw?.Id,
    titulo: ibNorm(raw?.titulo ?? raw?.Titulo),
    descripcion: ibNorm(raw?.descripcion ?? raw?.Descripcion),
    url: ibNorm(raw?.url ?? raw?.Url),
    tipo: ibNorm(raw?.tipo ?? raw?.Tipo),
    prioridad: Number(raw?.prioridad ?? raw?.Prioridad ?? 0) || 0,
    activo: ibToBool(raw?.activo ?? raw?.Activo ?? raw?.activa ?? raw?.Activa),
    fechaInicio: ibNorm(raw?.fechaInicio ?? raw?.FechaInicio ?? ""),
    fechaFin: ibNorm(raw?.fechaFin ?? raw?.FechaFin ?? ""),
  };
}

export async function infoBoardList({ activo, q } = {}) {
  const search = q?.trim() || undefined;
  return InfoBoardApi.list({ activo, search });
}

export const infoBoardGetById = id => InfoBoardApi.get(id);
export const infoBoardCreate = payload => InfoBoardApi.create(payload);
export const infoBoardUpdate = (id, payload) => InfoBoardApi.update(id, payload);
export const infoBoardRemove = id => InfoBoardApi.remove(id);
