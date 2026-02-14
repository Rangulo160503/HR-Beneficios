export class BeneficioGatewayFetch {
  constructor(client) {
    this.client = client;
  }

  list(options = {}) {
    return this.client.request("/api/Beneficio", options);
  }

  listByProveedor(proveedorId, options = {}) {
    return this.client.request(`/api/Beneficio/por-proveedor/${proveedorId}`, options);
  }

  listAprobacionesPendientes(options = {}) {
    return this.client.request("/api/Beneficio/aprobaciones/pendientes", options);
  }

  listAprobacionesAprobados(options = {}) {
    return this.client.request("/api/Beneficio/aprobaciones/aprobados", options);
  }

  get(id, options = {}) {
    return this.client.request(`/api/Beneficio/${id}`, options);
  }

  create(dto, options = {}) {
    return this.client.request("/api/Beneficio", { method: "POST", json: dto, ...options });
  }

  createForProveedor({ proveedorId, token, dto, options = {} } = {}) {
    const params = new URLSearchParams();
    if (proveedorId) params.set("proveedorId", proveedorId);
    if (token) params.set("token", token);
    const qs = params.toString();
    const suffix = qs ? `?${qs}` : "";
    return this.client.request(`/api/Beneficio${suffix}`, {
      method: "POST",
      json: dto,
      ...options,
    });
  }

  update(id, dto, options = {}) {
    return this.client.request(`/api/Beneficio/${id}`, { method: "PUT", json: dto, ...options });
  }

  remove(id, options = {}) {
    return this.client.request(`/api/Beneficio/${id}`, { method: "DELETE", ...options });
  }

  approve(id, options = {}) {
    return this.client.request(`/api/Beneficio/${id}/aprobar`, { method: "POST", json: {}, ...options });
  }

  reject(id, options = {}) {
    return this.client.request(`/api/Beneficio/${id}/rechazar`, { method: "POST", json: {}, ...options });
  }

  setDisponible(id, disponible, options = {}) {
    return this.client.request(`/api/Beneficio/${id}/disponible`, {
      method: "PUT",
      json: { disponible },
      ...options,
    });
  }
}
