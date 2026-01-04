export async function registerToqueBeneficio({ toqueBeneficioGateway, beneficioId, origen, options } = {}) {
  if (!beneficioId) return null;
  return toqueBeneficioGateway.registrar(beneficioId, origen, options);
}
