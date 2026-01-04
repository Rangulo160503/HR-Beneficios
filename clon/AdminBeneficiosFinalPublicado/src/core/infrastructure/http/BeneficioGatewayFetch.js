export class BeneficioGatewayFetch {
  constructor(client) {
    this.client = client;
  }

  list(options = {}) {
    return this.client.request("/api/Beneficio", options);
  }

  get(id, options = {}) {
    return this.client.request(`/api/Beneficio/${id}`, options);
  }

  create(dto, options = {}) {
    return this.client.request("/api/Beneficio", { method: "POST", json: dto, ...options });
  }

  update(id, dto, options = {}) {
    return this.client.request(`/api/Beneficio/${id}`, { method: "PUT", json: dto, ...options });
  }

  remove(id, options = {}) {
    return this.client.request(`/api/Beneficio/${id}`, { method: "DELETE", ...options });
  }
}
