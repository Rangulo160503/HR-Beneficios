export class AuthGatewayFetch {
  constructor({ baseUrl = "" } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async login({ path = "/login", body } = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body ?? {}),
    });

    if (!res.ok) {
      throw new Error(`Login failed: ${res.status}`);
    }

    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  }
}
