import {
  normalizeBeneficioId,
  normalizeImageSource,
  pickBeneficioImage,
} from "../../reglas/mapping/beneficio";

export async function getBenefitCardImage({ beneficioGateway, beneficio }) {
  if (!beneficio) return "";

  const inline = normalizeImageSource(pickBeneficioImage(beneficio));
  if (inline) return inline;

  const id = normalizeBeneficioId(beneficio);
  if (!id) return "";

  const detail = await beneficioGateway.get(id);
  return normalizeImageSource(pickBeneficioImage(detail));
}
