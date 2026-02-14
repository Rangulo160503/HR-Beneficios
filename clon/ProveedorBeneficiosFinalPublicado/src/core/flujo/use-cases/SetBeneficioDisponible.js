export async function setBeneficioDisponible({ beneficioGateway, beneficioId, disponible, options } = {}) {
  if (!beneficioId) return null;
  return beneficioGateway.setDisponible(beneficioId, disponible, options);
}
