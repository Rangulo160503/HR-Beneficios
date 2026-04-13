const target = import.meta.env.VITE_API_TARGET?.trim().toLowerCase() || "local";
const API_BASE = (
  target === "cloud"
    ? import.meta.env.VITE_API_BASE_CLOUD
    : import.meta.env.VITE_API_BASE
)?.replace(/\/$/, "") || "";

async function httpGet(path, { signal } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    mode: "cors",
    signal,
  });
  if (res.status === 204) return [];
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

async function httpPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
    mode: "cors",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const EP = {
  beneficios: () => `/api/Beneficio`,
  beneficioId: (id) => `/api/Beneficio/${id}`,
  categorias: () => `/api/Categoria`,
  categoriaId: (id) => `/api/Categoria/${id}`,
  proveedores: () => `/api/Proveedor`,
  proveedorId: (id) => `/api/Proveedor/${id}`,
  beneficioImagenPorBeneficio: (beneficioId) => `/api/BeneficioImagen/${beneficioId}`,
  toqueBeneficio: () => `/api/ToqueBeneficio`,
  rifaParticipacionCrear: () => `/api/RifaParticipacion`,
};

export const Api = {
  beneficios: {
    listar: (opts = {}) => httpGet(EP.beneficios(), opts),
    obtener: (id) => httpGet(EP.beneficioId(id)),
  },
  categorias: {
    listar: (opts = {}) => httpGet(EP.categorias(), opts),
    obtener: (id) => httpGet(EP.categoriaId(id)),
  },
  proveedores: {
    listar: (opts = {}) => httpGet(EP.proveedores(), opts),
    obtener: (id) => httpGet(EP.proveedorId(id)),
  },
  beneficioImagen: {
    obtenerPorBeneficio: (beneficioId) => httpGet(EP.beneficioImagenPorBeneficio(beneficioId)),
  },
  toqueBeneficio: {
    registrar: (beneficioId, origen) =>
      httpPost(EP.toqueBeneficio(), { beneficioId, origen }),
  },
  rifaParticipacion: {
    crear: (body) => httpPost(EP.rifaParticipacionCrear(), body),
  },
};
