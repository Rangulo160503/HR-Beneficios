import { mapProveedor } from "../../reglas/mapping/display";

export async function loadProveedoresList({ proveedorGateway, options } = {}) {
  const data = await proveedorGateway.list(options);
  return Array.isArray(data) ? data.map(mapProveedor) : [];
}
