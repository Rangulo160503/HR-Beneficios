export async function loadProveedoresList({ proveedorGateway }) {
  const data = await proveedorGateway.list();
  return Array.isArray(data) ? data : [];
}
