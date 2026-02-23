export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function createFetchClient({ baseUrl, onUnauthorized } = {}) {
  const normalizedBase = String(baseUrl ?? "").replace(/\/+$/, "");

  const request = async (path, { method = "GET", json, headers, signal, mode } = {}) => {
    const res = await fetch(`${normalizedBase}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(json ? { "Content-Type": "application/json" } : {}),
        ...(headers ?? {}),
      },
      body: json ? JSON.stringify(json) : undefined,
      signal,
      mode: mode ?? "cors",
      credentials: "include", // ✅ cookie hr_auth
    });

    if (res.status === 401) {
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