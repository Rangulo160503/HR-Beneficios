export async function loadAprobacionesPendientes({ beneficioGateway, options } = {}) {
  const data = await beneficioGateway.listAprobacionesPendientes(options);
  return Array.isArray(data) ? data : [];
}
