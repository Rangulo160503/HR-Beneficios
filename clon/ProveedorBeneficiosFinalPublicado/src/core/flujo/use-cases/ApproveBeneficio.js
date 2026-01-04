export async function approveBeneficio({ beneficioGateway, beneficioId, options } = {}) {
  if (!beneficioId) return null;
  return beneficioGateway.approve(beneficioId, options);
}
