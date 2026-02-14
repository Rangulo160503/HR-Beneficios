// src/services/infoBoardService.js
import API_BASE from "./apiBase";

const normalize = (v) => (typeof v === "string" ? v.trim() : v ?? "");

async function httpGetJson(path, { signal } = {}) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!res.ok) {
    // Intentar leer el body para mensaje más útil
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function getInfoBoard({ activo = true, q = "" } = {}) {
  const params = new URLSearchParams();
  if (activo !== undefined && activo !== null) params.set("activo", String(activo));
  if (q) params.set("q", q.trim());

  const qs = params.toString();
  const path = `/api/InfoBoard${qs ? `?${qs}` : ""}`;

  try {
    const data = await httpGetJson(path);
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  } catch (err) {
    const msg = err?.message || "Error desconocido";
    throw new Error(`No se pudo obtener la pizarra: ${msg}`);
  }
}

export function mapInfoBoardItem(raw) {
  return {
    id: raw?.infoBoardItemId ?? raw?.InfoBoardItemId ?? raw?.id ?? raw?.Id,
    titulo: normalize(raw?.titulo ?? raw?.Titulo),
    descripcion: normalize(raw?.descripcion ?? raw?.Descripcion),
    url: normalize(raw?.url ?? raw?.Url),
    tipo: normalize(raw?.tipo ?? raw?.Tipo),
  };
}
