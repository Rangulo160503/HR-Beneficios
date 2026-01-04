export class CategoriaGatewayFetch {
  constructor(client) {
    this.client = client;
  }

  list(options = {}) {
    return this.client.request("/api/Categoria", options);
  }

  get(id, options = {}) {
    return this.client.request(`/api/Categoria/${id}`, options);
  }

  create(dto, options = {}) {
    return this.client.request("/api/Categoria", { method: "POST", json: dto, ...options });
  }

  update(id, dto, options = {}) {
    return this.client.request(`/api/Categoria/${id}`, { method: "PUT", json: dto, ...options });
  }

  remove(id, options = {}) {
    return this.client.request(`/api/Categoria/${id}`, { method: "DELETE", ...options });
  }
}
