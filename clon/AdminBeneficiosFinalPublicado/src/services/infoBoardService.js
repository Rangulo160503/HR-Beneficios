import { InfoBoardApi } from "./adminApi";

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
  const search = q?.trim() || undefined;
  return InfoBoardApi.list({ activo, search });
}

export const getById = (id) => InfoBoardApi.get(id);
export const create = (payload) => InfoBoardApi.create(payload);
export const update = (id, payload) => InfoBoardApi.update(id, payload);
export const remove = (id) => InfoBoardApi.remove(id);
