export class BeneficioImagenGatewayFetch {
  constructor(client) {
    this.client = client;
  }

  listByBeneficio(beneficioId, options = {}) {
    return this.client.request(`/api/BeneficioImagen/${beneficioId}`, options);
  }

  get(imagenId, options = {}) {
    return this.client.request(`/api/BeneficioImagen/detalle/${imagenId}`, options);
  }

  create(dto, options = {}) {
    return this.client.request("/api/BeneficioImagen", { method: "POST", json: dto, ...options });
  }

  update(imagenId, dto, options = {}) {
    return this.client.request(`/api/BeneficioImagen/${imagenId}`, { method: "PUT", json: dto, ...options });
  }

  remove(imagenId, options = {}) {
    return this.client.request(`/api/BeneficioImagen/${imagenId}`, { method: "DELETE", ...options });
  }
}
