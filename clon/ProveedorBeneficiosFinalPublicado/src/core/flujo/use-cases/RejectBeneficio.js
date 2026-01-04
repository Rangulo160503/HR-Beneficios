export async function rejectBeneficio({ beneficioGateway, beneficioId, options } = {}) {
  if (!beneficioId) return null;
  return beneficioGateway.reject(beneficioId, options);
}
