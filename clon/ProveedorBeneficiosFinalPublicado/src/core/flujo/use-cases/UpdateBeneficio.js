export async function updateBeneficio({ beneficioGateway, beneficioId, dto, options } = {}) {
  if (!beneficioId) return null;
  return beneficioGateway.update(beneficioId, dto, options);
}
