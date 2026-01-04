import { normalizeBeneficio, normalizeBeneficiosList, normalizeBeneficioId } from "../../reglas/mapping/beneficio";

export async function saveBeneficio({ beneficioGateway, dto, editing }) {
  const id = normalizeBeneficioId(editing);

  if (id) {
    await beneficioGateway.update(id, dto);
    const fresh = await beneficioGateway.get(id);
    return { beneficio: normalizeBeneficio(fresh) };
  }

  const created = await beneficioGateway.create(dto);
  let raw = created;

  if (raw == null) {
    const list = await beneficioGateway.list();
    return { beneficios: normalizeBeneficiosList(list) };
  }

  if (typeof raw === "string") {
    raw = await beneficioGateway.get(raw);
  }

  return { beneficio: normalizeBeneficio(raw) };
}
