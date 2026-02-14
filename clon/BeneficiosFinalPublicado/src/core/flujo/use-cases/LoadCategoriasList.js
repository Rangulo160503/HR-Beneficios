import { mapCategoria } from "../../reglas/mapping/display";

export async function loadCategoriasList({ categoriaGateway, options } = {}) {
  const data = await categoriaGateway.list(options);
  return Array.isArray(data) ? data.map(mapCategoria) : [];
}
