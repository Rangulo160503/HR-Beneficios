export async function loadAprobacionesAprobados({ beneficioGateway, options } = {}) {
  const data = await beneficioGateway.listAprobacionesAprobados(options);
  return Array.isArray(data) ? data : [];
}
