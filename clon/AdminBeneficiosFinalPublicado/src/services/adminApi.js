// src/components/services/adminApi.js

// Puedes sobreescribir con VITE_API_BASE en el build/deploy
const DEFAULT_API = "https://hr-beneficios-api-grgmckc5dwdca9dc.canadacentral-01.azurewebsites.net";
const BASE_URL = (import.meta.env?.VITE_API_BASE || DEFAULT_API).replace(/\/+$/, "");

// ================= core fetch =================
async function req(path, { method = "GET", json, headers, signal, timeoutMs = 15000 } = {}) {
  const controller = signal ? null : new AbortController();
  const usedSignal = signal || controller?.signal;
  const timer = controller ? setTimeout(() => controller.abort("timeout"), timeoutMs) : null;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(json ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: json ? JSON.stringify(json) : undefined,
      signal: usedSignal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${method} ${path} → ${res.status} ${res.statusText}\n${text}`);
    }

    if (res.status === 204) return null;
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/* ===================== Categoría ===================== */
export const CategoriaApi = {
  list: () => req("/api/Categoria"),
  get:  (id) => req(`/api/Categoria/${id}`),

  // async porque usamos await
  create: async (dto) => {
    const body = {
      nombre: String(dto.titulo ?? dto.nombre ?? "").trim(),
      activa: typeof dto.activa === "boolean" ? dto.activa : true,
    };
    if (!body.nombre) throw new Error("El nombre es requerido.");
    const data = await req("/api/Categoria", { method: "POST", json: body });
    return data?.categoriaId ?? data?.id ?? String(data);
  },

  // async porque usamos await
  update: async (id, dto, current) => {
    const nombre = String(dto.titulo ?? dto.nombre ?? current?.nombre ?? current?.titulo ?? "").trim();
    const activa = typeof dto.activa === "boolean"
      ? dto.activa
      : (typeof current?.activa === "boolean" ? current.activa : true);
    if (!nombre) throw new Error("El nombre es requerido.");

    await req(`/api/Categoria/${id}`, { method: "PUT", json: { nombre, activa } });
    // sin return: la UI hace GET si necesita el canónico
  },

  remove: (id) => req(`/api/Categoria/${id}`, { method: "DELETE" }),
};

/* ===================== Proveedor ===================== */
export const ProveedorApi = {
  list: () => req("/api/Proveedor"),
  get:  (id) => req(`/api/Proveedor/${id}`),

  // async porque usamos await
  create: async (dto) => {
    const nombre = String(dto.nombre ?? "").trim();
    if (!nombre) throw new Error("El nombre es requerido.");
    const data = await req("/api/Proveedor", { method: "POST", json: { nombre } });
    return data?.proveedorId ?? data?.id ?? String(data);
  },

  // async porque usamos await
  update: async (id, dto) => {
    const nombre = String(dto.nombre ?? "").trim();
    if (!nombre) throw new Error("El nombre es requerido.");
    await req(`/api/Proveedor/${id}`, { method: "PUT", json: { nombre } });
    // sin return
  },

  remove: (id) => req(`/api/Proveedor/${id}`, { method: "DELETE" }),
};

/* ===================== Beneficio ===================== */
/* Contrato (Swagger): 
   POST/PUT: { titulo, descripcion, precioCRC, condiciones,
               vigenciaInicio, vigenciaFin, imagen, proveedorId, categoriaId }
*/

// UI -> API (sin sobreescribir imagen si no cambió)
function toApiBeneficio(ui) {
  const precioNum = Number(ui.precio ?? ui.precioCRC);
  const precioCRC = Number.isFinite(precioNum) && precioNum >= 0 ? precioNum : 0;

  let imagenBase64 = null;
  if (ui.imagen && typeof ui.imagen === "string") {
    imagenBase64 = ui.imagen; // base64 puro
  } else if (ui.imagenUrl && typeof ui.imagenUrl === "string" && ui.imagenUrl.startsWith("data:")) {
    const i = ui.imagenUrl.indexOf("base64,");
    if (i >= 0) imagenBase64 = ui.imagenUrl.slice(i + 7);
  }

  const payload = {
    titulo: ui.titulo ?? "",
    descripcion: ui.descripcion ?? "",
    precioCRC,
    condiciones: ui.condiciones ?? "",
    vigenciaInicio: ui.vigenciaInicio || null,
    vigenciaFin: ui.vigenciaFin || null,
    proveedorId: ui.proveedorId || null,
    categoriaId: ui.categoriaId || null,
  };
  if (imagenBase64) payload.imagen = imagenBase64; // ← solo si hay nueva imagen
  return payload;
}

// API -> UI (tolerante a camel/pascal y a anidados)
function fromApiBeneficio(b) {
  const b64 = b.imagenBase64 ?? b.ImagenBase64 ?? b.imagen ?? b.Imagen ?? null;
  const url =
    b.imagenUrl ?? b.ImagenUrl ??
    (b64 ? `data:image/jpeg;base64,${String(b64).replace(/\s/g, "")}` : "");

  const id = b.beneficioId ?? b.BeneficioId ?? b.id ?? b.Id;

  const proveedorNombre =
    b.proveedorNombre ?? b.ProveedorNombre ?? b.proveedor?.nombre ?? b.proveedor?.Nombre ?? "";
  const categoriaNombre =
    b.categoriaNombre ?? b.CategoriaNombre ?? b.categoria?.nombre ?? b.categoria?.titulo ?? "";

  return {
    id,
    titulo: b.titulo ?? b.Titulo ?? "",
    descripcion: b.descripcion ?? b.Descripcion ?? "",
    precio: Number(b.precioCRC ?? b.PrecioCRC ?? b.precio ?? 0) || 0,
    precioCRC: Number(b.precioCRC ?? b.PrecioCRC ?? b.precio ?? 0) || 0,
    moneda: "CRC",
    proveedorId: b.proveedorId ?? b.ProveedorId ?? "",
    proveedorNombre,
    categoriaId: b.categoriaId ?? b.CategoriaId ?? "",
    categoriaNombre,
    vigenciaInicio: b.vigenciaInicio ?? b.VigenciaInicio ?? "",
    vigenciaFin: b.vigenciaFin ?? b.VigenciaFin ?? "",
    imagenUrl: url,
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
    const data = await req("/api/Beneficio", { method: "POST", json: dto });
    // el backend suele devolver { beneficioId: "<guid>" } o el guid plano
    return data?.beneficioId ?? data?.id ?? String(data);
  },
  update: async (id, ui) => {
    const dto = toApiBeneficio(ui);
    await req(`/api/Beneficio/${id}`, { method: "PUT", json: dto });
    // sin return
  },
  remove: (id) => req(`/api/Beneficio/${id}`, { method: "DELETE" }),
};
