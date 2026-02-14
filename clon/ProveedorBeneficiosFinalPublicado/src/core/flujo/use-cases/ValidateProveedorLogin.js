export async function validateProveedorLogin({ proveedorGateway, proveedorId, options } = {}) {
  if (!proveedorId) return null;
  return proveedorGateway.validateLogin(proveedorId, options);
}
