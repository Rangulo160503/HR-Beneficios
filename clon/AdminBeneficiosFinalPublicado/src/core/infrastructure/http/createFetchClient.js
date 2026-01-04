import { isSessionExpired } from "../../reglas/session/isSessionExpired";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function createFetchClient({ baseUrl, sessionStore, onUnauthorized } = {}) {
  const normalizedBase = String(baseUrl ?? "").replace(/\/+$/, "");

  const buildAuthHeader = () => {
    const session = sessionStore?.getSession?.();
    if (!session?.access_token) return {};

    if (isSessionExpired(session)) {
      sessionStore?.clearSession?.();
      return {};
    }

    const type = session.token_type || "Bearer";
    return { Authorization: `${type} ${session.access_token}`.trim() };
  };

  const request = async (path, { method = "GET", json, headers, signal, mode } = {}) => {
    const res = await fetch(`${normalizedBase}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(json ? { "Content-Type": "application/json" } : {}),
        ...buildAuthHeader(),
        ...headers,
      },
      body: json ? JSON.stringify(json) : undefined,
      signal,
      mode: mode ?? "cors",
    });

    if (res.status === 401) {
      sessionStore?.clearSession?.();
      onUnauthorized?.();
      throw new Error("unauthorized");
    }

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => null);

    if (!res.ok) {
      const message = payload?.message || `${method} ${path} → ${res.status}`;
      throw new ApiError(message, res.status, payload);
    }

    if (res.status === 204) return null;
    return payload;
  };

  return { request };
}
