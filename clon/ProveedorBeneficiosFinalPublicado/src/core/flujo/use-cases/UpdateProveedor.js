export async function updateProveedor({ proveedorGateway, proveedorId, dto, options } = {}) {
  if (!proveedorId) return null;
  return proveedorGateway.update(proveedorId, dto, options);
}
