import { normalizeBeneficiosList } from "../../reglas/mapping/beneficio";
import { mapBenefit } from "../../reglas/mapping/display";

export async function loadBeneficiosList({ beneficioGateway, options } = {}) {
  const data = await beneficioGateway.list(options);
  return normalizeBeneficiosList(data).map(mapBenefit);
}
