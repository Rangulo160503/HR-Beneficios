import { normalizeBeneficiosList } from "../../reglas/mapping/beneficio";

export async function loadBeneficiosByProveedor({ beneficioGateway, proveedorId, options } = {}) {
  if (!proveedorId) return [];
  const data = await beneficioGateway.listByProveedor(proveedorId, options);
  return normalizeBeneficiosList(data);
}
