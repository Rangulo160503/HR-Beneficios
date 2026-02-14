export async function loadBeneficioImagenes({ beneficioImagenGateway, beneficioId, options } = {}) {
  if (!beneficioId) return [];
  const data = await beneficioImagenGateway.listByBeneficio(beneficioId, options);
  return Array.isArray(data) ? data : [];
}
