const CLOUD = "https://hr-beneficios-api-grgmckc5dwdca9dc.canadacentral-01.azurewebsites.net";
const LOCAL = "https://localhost:5001";
const TARGET = "local";
const API_BASE = (TARGET === "cloud" ? CLOUD : LOCAL).replace(/\/$/, "");

async function httpGet(path) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    mode: "cors",
  });
  const ct = res.headers.get("content-type") || "";
  if (res.status === 204) return [];
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} – ${body}`);
  }
  return ct.includes("application/json") ? res.json() : res.text();
}

async function httpPost(path, body) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    mode: "cors",
  });
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} – ${await res.text()}`);
  return ct.includes("application/json") ? res.json() : res.text();
}

async function httpPut(path, body) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    mode: "cors",
  });
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} – ${await res.text()}`);
  return ct.includes("application/json") ? res.json() : res.text();
}

async function httpDelete(path) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Accept: "application/json" },
    mode: "cors",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} – ${await res.text()}`);
  return null;
}

const EP = {
  beneficios: () => `/api/Beneficio`,
  beneficiosPendientes: () => `/api/Beneficio/pendientes`,
  beneficiosRechazados: () => `/api/Beneficio/rechazados`,
  beneficioId: (id) => `/api/Beneficio/${id}`,
  categorias: () => `/api/Categoria`,
  categoriaId: (id) => `/api/Categoria/${id}`,
  proveedores: () => `/api/Proveedor`,
  proveedorId: (id) => `/api/Proveedor/${id}`,
};

export const Api = {
  beneficios: {
    obtener: (id) => httpGet(EP.beneficioId(id)),
    pendientes: () => httpGet(EP.beneficiosPendientes()),
    rechazados: () => httpGet(EP.beneficiosRechazados()),
    agregar: (payload) => {
      const params = new URLSearchParams(window.location.search);
      const proveedorId = params.get("proveedorId");
      const token = params.get("token");
      if (!proveedorId || !token) {
        throw new Error("No hay proveedorId o token en la URL");
      }
      return httpPost(`${EP.beneficios()}?proveedorId=${proveedorId}&token=${token}`, payload);
    },
    editar: (id, payload) => httpPut(EP.beneficioId(id), payload),
    eliminar: (id) => httpDelete(EP.beneficioId(id)),
    listarPorProveedorFront: async (proveedorId) => {
      const [aprobados, pendientes, rechazados] = await Promise.all([
        httpGet(EP.beneficios()),
        httpGet(EP.beneficiosPendientes()),
        httpGet(EP.beneficiosRechazados()),
      ]);
      const all = [...(aprobados || []), ...(pendientes || []), ...(rechazados || [])];
      const norm = (v) => String(v || "").toLowerCase();
      return (all || []).filter((x) => {
        const idModelo = x.proveedorId ?? x.ProveedorId;
        return norm(idModelo) === norm(proveedorId);
      });
    },
  },
  categorias: {
    listar: () => httpGet(EP.categorias()),
    obtener: (id) => httpGet(EP.categoriaId(id)),
  },
  proveedores: {
    obtener: (id) => httpGet(EP.proveedorId(id)),
    validarLogin: (id) => httpGet(`/api/Proveedor/validar-login/${id}`),
  },
};
