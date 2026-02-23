export async function createRifaParticipacion({ rifaParticipacionGateway, dto, options } = {}) {
  return rifaParticipacionGateway.create(dto, options);
}
