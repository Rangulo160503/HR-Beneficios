export class ToqueBeneficioGatewayFetch {
  constructor(client) {
    this.client = client;
  }

  analytics(beneficioId, range = "1W", options = {}, granularity) {
    const params = new URLSearchParams({ range });
    if (granularity) params.set("granularity", granularity);
    return this.client.request(
      `/api/ToqueBeneficio/analytics/${beneficioId}?${params.toString()}`,
      options
    );
  }

  resumen(range = "1W", options = {}) {
  console.count("CALL ToqueBeneficio.resumen");
  console.trace("TRACE ToqueBeneficio.resumen");
  return this.client.request(`/api/ToqueBeneficio/resumen?range=${range}`, options);
}


  registrar(beneficioId, origen, options = {}) {
    return this.client.request("/api/ToqueBeneficio", {
      method: "POST",
      json: { beneficioId, origen },
      ...options,
    });
  }
}
