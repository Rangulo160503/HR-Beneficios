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
}
