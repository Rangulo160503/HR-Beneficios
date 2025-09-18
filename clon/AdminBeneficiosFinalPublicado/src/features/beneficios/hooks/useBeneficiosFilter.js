import { useMemo } from "react";

const lower = (x) => (x?.toString?.() || "").toLowerCase();

export default function useBeneficiosFilter(items, selCat, selProv, query) {
  return useMemo(() => {
    const q = lower(query);
    return items.filter((b) => {
      const bCatId    = lower(b.categoriaId);
      const bProvId   = lower(b.proveedorId);
      const bCatName  = lower(b.categoriaNombre);
      const bProvName = lower(b.proveedorNombre);

      // selCat y selProv llegan como "id|name:<texto>" o solo id
      const byCat = !selCat
        ? true
        : selCat.startsWith("name:")
          ? bCatName === lower(selCat.slice(5))
          : bCatId === lower(selCat);

      const byProv = !selProv
        ? true
        : selProv.startsWith("name:")
          ? bProvName === lower(selProv.slice(5))
          : bProvId === lower(selProv);

      const hayTexto = [b.titulo, b.proveedorNombre, b.categoriaNombre].filter(Boolean).join(" ").toLowerCase();
      const byQ = !q || hayTexto.includes(q);
      return byCat && byProv && byQ;
    });
  }, [items, selCat, selProv, query]);
}
