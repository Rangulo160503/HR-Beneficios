export class BeneficioImagenGatewayFetch {
  constructor(client) {
    this.client = client;
  }

  listByBeneficio(beneficioId, options = {}) {
    return this.client.request(`/api/BeneficioImagen/${beneficioId}`, options);
  }
}
