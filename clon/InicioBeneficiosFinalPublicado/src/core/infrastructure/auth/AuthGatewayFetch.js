export class AuthGatewayFetch {
  constructor({ baseUrl = "", credentialsPath = "/login", tokenPath = "/login" } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.credentialsPath = credentialsPath;
    this.tokenPath = tokenPath;
  }

  async loginWithCredentials({ usuario, password, path, options } = {}) {
    return this.#post(path ?? this.credentialsPath, { usuario, password }, options);
  }

  async loginWithToken({ token, path, options } = {}) {
    return this.#post(path ?? this.tokenPath, { token }, options);
  }

  async #post(path, body, options) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      credentials: options?.credentials ?? "include",
      body: JSON.stringify(body ?? {}),
      mode: options?.mode ?? "cors",
      signal: options?.signal,
    });

    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => null);

    if (!res.ok) {
      const message = payload?.message || payload?.mensaje || `Login failed: ${res.status}`;
      const error = new Error(message);
      error.status = res.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  }
}
