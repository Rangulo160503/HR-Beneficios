export async function createBeneficioForProveedor({ beneficioGateway, proveedorId, token, dto, options } = {}) {
  return beneficioGateway.createForProveedor({ proveedorId, token, dto, options });
}
