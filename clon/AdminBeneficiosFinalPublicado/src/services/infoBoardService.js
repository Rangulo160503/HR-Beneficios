const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

async function request(path, { method = "GET", json, expectList = false } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(json ? { "Content-Type": "application/json" } : {}),
    },
    body: json ? JSON.stringify(json) : undefined,
    mode: "cors",
  });

  if (res.status === 204) return expectList ? [] : null;
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

const normalize = (v) => (typeof v === "string" ? v.trim() : v ?? "");
const toBool = (v) => Boolean(v === true || v === "true" || v === 1 || v === "1");

export function mapInfoBoard(raw) {
  return {
    id: raw?.infoBoardItemId ?? raw?.InfoBoardItemId ?? raw?.id ?? raw?.Id,
    titulo: normalize(raw?.titulo ?? raw?.Titulo),
    descripcion: normalize(raw?.descripcion ?? raw?.Descripcion),
    url: normalize(raw?.url ?? raw?.Url),
    tipo: normalize(raw?.tipo ?? raw?.Tipo),
    prioridad: Number(raw?.prioridad ?? raw?.Prioridad ?? 0) || 0,
    activo: toBool(raw?.activo ?? raw?.Activo ?? raw?.activa ?? raw?.Activa),
    fechaInicio: normalize(raw?.fechaInicio ?? raw?.FechaInicio ?? ""),
    fechaFin: normalize(raw?.fechaFin ?? raw?.FechaFin ?? ""),
  };
}

export async function list({ activo, q } = {}) {
  const params = new URLSearchParams();
  if (activo !== undefined && activo !== null) params.set("activo", String(activo));
  if (q) params.set("q", q.trim());
  const qs = params.toString();
  return request(`/api/InfoBoard${qs ? `?${qs}` : ""}`, { expectList: true });
}

export const getById = (id) => request(`/api/InfoBoard/${id}`);
export const create = (payload) => request(`/api/InfoBoard`, { method: "POST", json: payload });
export const update = (id, payload) => request(`/api/InfoBoard/${id}`, { method: "PUT", json: payload });
export const remove = (id) => request(`/api/InfoBoard/${id}`, { method: "DELETE" });
