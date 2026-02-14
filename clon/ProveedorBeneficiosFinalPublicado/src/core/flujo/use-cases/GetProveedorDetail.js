export async function getProveedorDetail({ proveedorGateway, proveedorId, options } = {}) {
  if (!proveedorId) return null;
  return proveedorGateway.get(proveedorId, options);
}
