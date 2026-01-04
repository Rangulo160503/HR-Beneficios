export class AuthGatewayFetch {
  constructor({ baseUrl = "", credentialsPath = "/login", tokenPath = "/login" } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.credentialsPath = credentialsPath;
    this.tokenPath = tokenPath;
  }

  async login({ path = "/login", body } = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(body ?? {}),
    });

    if (!res.ok) {
      let message = `Login failed: ${res.status}`;
      try {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const payload = await res.json();
          message = payload?.mensaje || payload?.message || message;
        } else {
          const text = await res.text();
          if (text) message = text;
        }
      } catch (error) {
        console.error("AuthGatewayFetch login error parse", error);
      }
      throw new Error(message);
    }

    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  }

  async loginWithCredentials({ usuario, password, path } = {}) {
    return this.login({
      path: path ?? this.credentialsPath,
      body: { usuario, password },
    });
  }

  async loginWithToken({ token, path } = {}) {
    return this.login({
      path: path ?? this.tokenPath,
      body: { token },
    });
  }
}
