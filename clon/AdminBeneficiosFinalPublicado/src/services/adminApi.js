// src/services/adminApi.js
const BASE_URL = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

async function req(path, { method = "GET", json, headers, signal } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json ? JSON.stringify(json) : undefined,
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${path} → ${res.status} ${res.statusText}\n${text}`);
  }
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

/* ===================== Categoría ===================== */
export const CategoriaApi = {
  list: () => req("/api/Categoria"),
  get: (id) => req(`/api/Categoria/${id}`),
  create: (dto) => req("/api/Categoria", { method: "POST", json: dto }),
  update: (id, dto) => req(`/api/Categoria/${id}`, { method: "PUT", json: dto }),
  remove: (id) => req(`/api/Categoria/${id}`, { method: "DELETE" }),
};

/* ===================== Proveedor ===================== */
export const ProveedorApi = {
  list: () => req("/api/Proveedor"),
  get: (id) => req(`/api/Proveedor/${id}`),
  create: (dto) => req("/api/Proveedor", { method: "POST", json: dto }),
  update: (id, dto) => req(`/api/Proveedor/${id}`, { method: "PUT", json: dto }),
  remove: (id) => req(`/api/Proveedor/${id}`, { method: "DELETE" }),
};

/* ===================== Beneficio ===================== */
/* Mapea API ↔ UI con tu contrato real:
   POST/PUT espera:
   {
     "titulo","descripcion","precioCRC","condiciones",
     "vigenciaInicio","vigenciaFin","imagen","proveedorId","categoriaId"
   }
*/

// ← UI -> API (envío). Extrae base64 limpio si viene dataURL.
function toApiBeneficio(ui) {
  let imagenBase64;
  if (ui.imagenUrl?.startsWith("data:")) {
    const i = ui.imagenUrl.indexOf("base64,");
    if (i >= 0) imagenBase64 = ui.imagenUrl.slice(i + "base64,".length);
  }
  return {
    // Para POST no mandes id; para PUT tu endpoint lo toma por ruta (/api/Beneficio/{id})
    titulo: ui.titulo,
    descripcion: ui.descripcion ?? "",
    precioCRC: Number(ui.precio ?? 0),
    condiciones: ui.condiciones ?? "",
    vigenciaInicio: ui.vigenciaInicio || null,
    vigenciaFin: ui.vigenciaFin || null,
    imagen: imagenBase64 ?? null,   // ← C# byte[] Imagen acepta base64 en JSON
    proveedorId: ui.proveedorId,
    categoriaId: ui.categoriaId,
  };
}

// ← API -> UI (lectura). Convierte imagen base64 -> dataURL para mostrarla.
function fromApiBeneficio(b) {
  return {
    id: b.beneficioId ?? b.BeneficioId ?? b.id,
    titulo: b.titulo ?? b.Titulo ?? "",
    descripcion: b.descripcion ?? b.Descripcion ?? "",
    precio: Number(b.precioCRC ?? b.PrecioCRC ?? 0),
    moneda: "CRC",
    proveedorId: b.proveedorId ?? b.ProveedorId ?? "",
    proveedorNombre: b.proveedorNombre ?? b.ProveedorNombre ?? b.proveedor?.nombre ?? "",
    categoriaId: b.categoriaId ?? b.CategoriaId ?? "",
    categoriaNombre: b.categoriaNombre ?? b.CategoriaNombre ?? b.categoria?.titulo ?? "",
    disponible: true, // no existe en BD: fijo true en UI
    imagenUrl:
      b.imagenUrl ??
      b.ImagenUrl ??
      (b.imagenBase64 ? `data:image/jpeg;base64,${b.imagenBase64}` :
       b.ImagenBase64 ? `data:image/jpeg;base64,${b.ImagenBase64}` : ""),
  };
}

export const BeneficioApi = {
  list: async () => {
    const data = await req("/api/Beneficio");
    return Array.isArray(data) ? data.map(fromApiBeneficio) : [];
  },
  get: async (id) => fromApiBeneficio(await req(`/api/Beneficio/${id}`)),
  create: async (ui) => {
    const dto = toApiBeneficio(ui);
    const created = await req("/api/Beneficio", { method: "POST", json: dto });
    return fromApiBeneficio(created);
  },
  update: async (id, ui) => {
    const dto = toApiBeneficio(ui); // el id va en la ruta
    const updated = await req(`/api/Beneficio/${id}`, { method: "PUT", json: dto });
    return fromApiBeneficio(updated);
  },
  remove: (id) => req(`/api/Beneficio/${id}`, { method: "DELETE" }),
};
