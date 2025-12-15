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
    access_token: "mock-token",
    token_type: "Bearer",
    expires_in: 60 * 60,
    user: { usuario: envUser, mock: true },
  };
}

export async function adminLogin({ user, pass }) {
  if (useMock) {
    return validateMockLogin(user, pass);
  }

  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ correo: user, password: pass }),
  });

  if (res.status === 401) {
    throw new Error("Credenciales inválidas");
  }

  if (!res.ok) {
    throw new Error("No se pudo iniciar sesión");
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
