export class ProveedorGatewayFetch {
  constructor(client) {
    this.client = client;
  }

  list(options = {}) {
    return this.client.request("/api/Proveedor", options);
  }

  get(id, options = {}) {
    return this.client.request(`/api/Proveedor/${id}`, options);
  }

  create(dto, options = {}) {
    return this.client.request("/api/Proveedor", { method: "POST", json: dto, ...options });
  }

  update(id, dto, options = {}) {
    return this.client.request(`/api/Proveedor/${id}`, { method: "PUT", json: dto, ...options });
  }

  remove(id, options = {}) {
    return this.client.request(`/api/Proveedor/${id}`, { method: "DELETE", ...options });
  }

  validateLogin(id, options = {}) {
    return this.client.request(`/api/Proveedor/validar-login/${id}`, options);
  }
}
