import { normalizeBeneficio } from "../../reglas/mapping/beneficio";

export async function getBeneficioDetail({ beneficioGateway, beneficioId }) {
  if (!beneficioId) return null;
  const data = await beneficioGateway.get(beneficioId);
  return normalizeBeneficio(data);
}
