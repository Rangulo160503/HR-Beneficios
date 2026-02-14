export async function loadCategoriasList({ categoriaGateway }) {
  const data = await categoriaGateway.list();
  return Array.isArray(data) ? data : [];
}
