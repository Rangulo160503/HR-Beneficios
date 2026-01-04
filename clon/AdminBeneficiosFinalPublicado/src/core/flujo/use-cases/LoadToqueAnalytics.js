import { normalizeToqueAnalytics } from "../../reglas/mapping/beneficio";

export async function loadToqueAnalytics({ toqueBeneficioGateway, beneficioId, range }) {
  if (!beneficioId) return null;
  const data = await toqueBeneficioGateway.analytics(beneficioId, range);
  return normalizeToqueAnalytics(data);
}
