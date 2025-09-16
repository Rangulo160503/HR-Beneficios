const BASE_URL = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

// ============== core fetch ==============
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
  get:  (id) => req(`/api/Categoria/${id}`),
  create: (dto) => {
    // backend usa { nombre }; desde UI llega { titulo }
    const body = { nombre: dto.titulo ?? dto.nombre ?? "" };
    return req("/api/Categoria", { method: "POST", json: body });
  },
  update: (id, dto) => {
    const body = { nombre: dto.titulo ?? dto.nombre ?? "" };
    return req(`/api/Categoria/${id}`, { method: "PUT", json: body });
  },
  remove: (id) => req(`/api/Categoria/${id}`, { method: "DELETE" }),
};

/* ===================== Proveedor ===================== */
export const ProveedorApi = {
  list: () => req("/api/Proveedor"),
  get:  (id) => req(`/api/Proveedor/${id}`),
  create: (dto) => {
    const body = { nombre: dto.nombre ?? "" };
    return req("/api/Proveedor", { method: "POST", json: body });
  },
  update: (id, dto) => {
    const body = { nombre: dto.nombre ?? "" };
    return req(`/api/Proveedor/${id}`, { method: "PUT", json: body });
  },
  remove: (id) => req(`/api/Proveedor/${id}`, { method: "DELETE" }),
};

/* ===================== Beneficio ===================== */
/* Contrato del API (Swagger): 
   POST/PUT: { titulo, descripcion, precioCRC, condiciones,
               vigenciaInicio, vigenciaFin, imagen, proveedorId, categoriaId }
*/

// UI -> API
function toApiBeneficio(ui) {
  // imagenUrl puede ser dataURL; extrae solo la parte base64
  let imagenBase64 = null;
  if (ui.imagenUrl && typeof ui.imagenUrl === "string" && ui.imagenUrl.startsWith("data:")) {
    const i = ui.imagenUrl.indexOf("base64,");
    if (i >= 0) imagenBase64 = ui.imagenUrl.slice(i + "base64,".length);
  } else if (ui.imagen) {
    // si ya trae base64 “puro”
    imagenBase64 = ui.imagen;
  }

  return {
    titulo: ui.titulo ?? "",
    descripcion: ui.descripcion ?? "",
    precioCRC: Number(ui.precio ?? ui.precioCRC ?? 0),
    condiciones: ui.condiciones ?? "",
    vigenciaInicio: ui.vigenciaInicio || null,
    vigenciaFin: ui.vigenciaFin || null,
    imagen: imagenBase64,        // byte[] Imagen en C# mapea desde base64
    proveedorId: ui.proveedorId || null,
    categoriaId: ui.categoriaId || null,
  };
}

// services/adminApi.js (o .ts) – REEMPLAZA SOLO ESTA PARTE

// API -> UI
function fromApiBeneficio(b) {
  // la API suele devolver: imagen (base64), o imagenUrl
  const b64 =
    b.imagenBase64 || b.ImagenBase64 || b.imagen || b.Imagen || null;

  const url =
    b.imagenUrl || b.ImagenUrl ||
    (b64 ? `data:image/jpeg;base64,${String(b64).replace(/\s/g, "")}` : "");

  return {
    id: b.beneficioId ?? b.BeneficioId ?? b.id ?? b.Id,
    titulo: b.titulo ?? b.Titulo ?? "",
    descripcion: b.descripcion ?? b.Descripcion ?? "",
    precio: Number(b.precioCRC ?? b.PrecioCRC ?? b.precio ?? 0),
    precioCRC: Number(b.precioCRC ?? b.PrecioCRC ?? b.precio ?? 0),
    moneda: "CRC",
    proveedorId: b.proveedorId ?? b.ProveedorId ?? "",
    proveedorNombre: b.proveedorNombre ?? b.ProveedorNombre ?? b.proveedor?.nombre ?? "",
    categoriaId: b.categoriaId ?? b.CategoriaId ?? "",
    categoriaNombre: b.categoriaNombre ?? b.CategoriaNombre ?? b.categoria?.titulo ?? "",
    vigenciaInicio: b.vigenciaInicio ?? b.VigenciaInicio ?? "",
    vigenciaFin: b.vigenciaFin ?? b.VigenciaFin ?? "",
    imagenUrl: url,        // ← ahora sí
    // opcional por si querés reutilizar:
    imagenBase64: b64 || null,
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
    const dto = toApiBeneficio(ui); // id va en la ruta
    const updated = await req(`/api/Beneficio/${id}`, { method: "PUT", json: dto });
    return fromApiBeneficio(updated);
  },
  remove: (id) => req(`/api/Beneficio/${id}`, { method: "DELETE" }),
};
