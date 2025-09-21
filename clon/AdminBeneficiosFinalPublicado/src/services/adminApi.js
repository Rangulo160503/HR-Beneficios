// src/services/adminApi.js
const BASE_URL = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

async function req(path, { method="GET", json, headers, signal } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { Accept: "application/json", ...(json ? { "Content-Type": "application/json" } : {}), ...headers },
    body: json ? JSON.stringify(json) : undefined,
    signal,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const BeneficioApi = {
  list:  (o={}) => req("/api/Beneficio", o),
  get:   (id,o={}) => req(`/api/Beneficio/${id}`, o),
  create:(dto,o={}) => req("/api/Beneficio", { method:"POST", json:dto, ...o }),
  update:(id,dto,o={}) => req(`/api/Beneficio/${id}`, { method:"PUT", json:dto, ...o }),
  remove:(id,o={}) => req(`/api/Beneficio/${id}`, { method:"DELETE", ...o }),
};

// src/services/adminApi.js
export const CategoriaApi = {
  list:  (o={}) => req("/api/Categoria", o),
  get:   (id,o={}) => req(`/api/Categoria/${id}`, o),
  create:(dto,o={}) => req("/api/Categoria", { method: "POST", json: dto, ...o }), // usa { nombre } (y opcionalmente { activa })
  update:(id,dto,o={}) => req(`/api/Categoria/${id}`, { method:"PUT", json:dto, ...o }),
  remove:(id,o={}) => req(`/api/Categoria/${id}`, { method:"DELETE", ...o }),
};


export const ProveedorApi = {
  list:  (o={}) => req("/api/Proveedor", o),
  get:   (id,o={}) => req(`/api/Proveedor/${id}`, o),
  create:(dto,o={}) => req("/api/Proveedor", { method:"POST", json:dto, ...o }),   // usa { nombre }
  update:(id,dto,o={}) => req(`/api/Proveedor/${id}`, { method:"PUT", json:dto, ...o }),
  remove:(id,o={}) => req(`/api/Proveedor/${id}`, { method:"DELETE", ...o }),
};
