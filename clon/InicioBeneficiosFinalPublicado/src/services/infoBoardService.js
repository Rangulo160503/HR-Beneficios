import { httpGet } from "./api";

const normalize = (v) => (typeof v === "string" ? v.trim() : v ?? "");

export async function getInfoBoard({ activo = true, q = "" } = {}) {
  const params = new URLSearchParams();
  if (activo !== undefined && activo !== null) params.set("activo", String(activo));
  if (q) params.set("q", q.trim());

  const qs = params.toString();
  const path = `/api/InfoBoard${qs ? `?${qs}` : ""}`;

  try {
    const data = await httpGet(path);
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
