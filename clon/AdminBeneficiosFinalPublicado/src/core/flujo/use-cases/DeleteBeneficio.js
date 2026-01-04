export async function deleteBeneficio({ beneficioGateway, beneficioId }) {
  if (!beneficioId) return;
  await beneficioGateway.remove(beneficioId);
}
