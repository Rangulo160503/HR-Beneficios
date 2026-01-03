// src/services/authApi.js
import { getApiBase } from "./apiBase";

const useMock = (import.meta.env.VITE_ADMIN_USE_MOCK || "false")
  .toString()
  .toLowerCase() === "true";

function validateMockLogin(user, pass) {
  const envUser = import.meta.env.VITE_ADMIN_USER || "admin";
  const envPass = import.meta.env.VITE_ADMIN_PASS || "admin123";

  if (user !== envUser || pass !== envPass) {
    throw new Error("Credenciales inválidas");
  }

  return {
    token: "mock-token",
    tokenType: "Bearer",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    profile: { usuario: envUser, mock: true },
  };
}

export async function adminLogin({ user, pass }) {
  if (useMock) return validateMockLogin(user, pass);

  const API_BASE = getApiBase();

  const res = await fetch(`${API_BASE}/api/AdminAuth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ usuario: user, password: pass }),
  });

  if (res.status === 401) throw new Error("Credenciales inválidas");
  if (res.status === 403) throw new Error("Usuario inactivo");
  if (!res.ok) throw new Error("No se pudo iniciar sesión");

  return res.json();
}
