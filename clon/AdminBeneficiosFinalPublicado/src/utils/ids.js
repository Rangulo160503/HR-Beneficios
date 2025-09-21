export const normId = (v) => (v == null ? "" : String(v).trim());
export const getProvId = (r) => normId(r?.id ?? r?.proveedorId ?? r?.Id ?? r?.ProveedorId);
export const getCatId  = (r) => normId(
  r?.id ?? r?.Id ??
  r?.categoriaId ?? r?.CategoriaId ??
  r?.categoriaID ?? r?.CategoriaID ??
  r?.idCategoria ?? r?.IdCategoria ??
  r?.categoria?.id ?? r?.categoria?.Id
);
export const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isGuid = (s) => typeof s === "string" && GUID_RE.test(s);
