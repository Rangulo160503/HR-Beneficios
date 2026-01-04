export class ContactoGatewayFetch {
  async submit(url, dto, options = {}) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: JSON.stringify(dto ?? {}),
      signal: options.signal,
    });

    if (!res.ok) {
      const payload = await res.text().catch(() => "");
      throw new Error(payload || `Error ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    return contentType.includes("application/json")
      ? res.json().catch(() => ({}))
      : res.text().catch(() => "");
  }
}
