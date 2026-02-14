import {
  mergeBeneficiosWithSummary,
  normalizeToqueSummary,
} from "../../reglas/mapping/beneficio";

export async function loadToqueSummary({ toqueBeneficioGateway, range, beneficios }) {
  const data = await toqueBeneficioGateway.resumen(range);
  const summary = normalizeToqueSummary(data);
  return {
    summary,
    beneficios: mergeBeneficiosWithSummary(beneficios, summary),
  };
}
