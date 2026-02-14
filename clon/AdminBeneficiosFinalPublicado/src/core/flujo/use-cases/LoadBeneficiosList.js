import { normalizeBeneficiosList } from "../../reglas/mapping/beneficio";

export async function loadBeneficiosList({ beneficioGateway }) {
  const data = await beneficioGateway.list();
  return normalizeBeneficiosList(data);
}
