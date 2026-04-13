import { BeneficioApi } from "../../../services/adminApi";

const normId = v => (v == null ? "" : String(v).trim());
const getCatId = r =>
  normId(
    r?.id ??
      r?.Id ??
      r?.categoriaId ??
      r?.CategoriaId ??
      r?.categoriaID ??
      r?.CategoriaID ??
      r?.idCategoria ??
      r?.IdCategoria ??
      r?.categoria?.id ??
      r?.categoria?.Id
  );

export function useCategoriaReasignacion({
  cats,
  accionesBeneficios,
  setCategoriaEnUso,
  setShowCategoriaEnUso,
  setNav,
  navBeneficiosKey,
  setEditing,
  setShowForm
}) {
  const handleReasignar = async ({ fromCategoriaId, toCategoriaId, beneficioIds }) => {
    const fromId = normId(fromCategoriaId);
    const toId = normId(toCategoriaId);
    await BeneficioApi.reassignCategoria({
      fromCategoriaId: fromId,
      toCategoriaId: toId,
      beneficioIds
    });
    const destino = cats.find(c => getCatId(c) === toId);
    const destinoNombre = destino?.nombre ?? destino?.titulo;
    accionesBeneficios?.setItems?.((prev = []) => {
      return prev.map(b => {
        const bId = normId(b?.beneficioId ?? b?.id);
        const matchByList =
          Array.isArray(beneficioIds) && beneficioIds.length > 0
            ? beneficioIds.includes(bId)
            : normId(b?.categoriaId ?? b?.CategoriaId ?? b?.categoria?.id) === fromId;
        if (!matchByList) return b;
        return {
          ...b,
          categoriaId: toId,
          categoriaNombre: destinoNombre ?? b.categoriaNombre
        };
      });
    });
    setCategoriaEnUso(null);
    setShowCategoriaEnUso(false);
  };

  const handleEditFromModal = beneficio => {
    setNav?.(navBeneficiosKey);
    setShowCategoriaEnUso(false);
    setCategoriaEnUso(null);
    setEditing?.(beneficio);
    setShowForm?.(true);
  };

  return { handleReasignar, handleEditFromModal };
}
