export class RifaParticipacionGatewayFetch {
  constructor(client) {
    this.client = client;
  }

  create(dto, options = {}) {
    return this.client.request("/api/RifaParticipacion", {
      method: "POST",
      json: dto,
      ...options,
    });
  }
}
