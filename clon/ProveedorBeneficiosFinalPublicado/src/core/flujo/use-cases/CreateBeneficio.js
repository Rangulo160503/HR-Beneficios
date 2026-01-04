export async function createBeneficio({ beneficioGateway, dto, options } = {}) {
  return beneficioGateway.create(dto, options);
}
