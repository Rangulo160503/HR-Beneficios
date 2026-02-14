export async function deleteBeneficio({ beneficioGateway, beneficioId, options } = {}) {
  if (!beneficioId) return null;
  return beneficioGateway.remove(beneficioId, options);
}
