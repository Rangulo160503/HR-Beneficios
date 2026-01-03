// src/components/Display/useFilteredBenefits.js
import { useMemo } from "react";
import {
  normalize,
  tokenize,
  expandWithSynonyms,
  scoreItem,
} from "./fuzzySearch";

export function useFilteredBenefits({
  items,
  categorias,
  proveedores,
  busqueda,
  catSel,
  provSel,
}) {
  const indexed = useMemo(() => {
    return items.map((it) => ({
      ...it,
      _index: normalize(
        [
          it.titulo,
          it.descripcion,
          it.condiciones,
          it.proveedorNombre || it.proveedor,
          it.categoriaNombre || it.categoria?.nombre || it.categoria?.titulo
        ].filter(Boolean).join(" ")
      )
    }));
  }, [items]);

  const q = busqueda.trim();
  const qTokensBase = useMemo(() => tokenize(q), [q]);
  const qTokens = useMemo(() => expandWithSynonyms(qTokensBase), [qTokensBase]);

  const filtered = useMemo(() => {
    const source = indexed.length ? indexed : items;

    return source
      .filter((x) => {
        // categoría
        const byCatId =
          !catSel ||
          String(x.categoriaId ?? x.categoria?.id ?? x.categoria) === String(catSel);

        const catNameSel = categorias.find((c) => String(c.id) === String(catSel));
        const byCatName =
          !catSel ||
          String(x.categoriaNombre || x.categoria || "").toLowerCase() ===
            String((catNameSel?.nombre || catNameSel?.titulo || "")).toLowerCase();

        const matchCategoria = !catSel || byCatId || byCatName;

        // proveedor
        const byProvId =
          !provSel ||
          String(x.proveedorId ?? x.proveedor?.id ?? x.proveedor) === String(provSel);

        const provNameSel = proveedores.find((p) => String(p.id) === String(provSel));
        const byProvName =
          !provSel ||
          String(x.proveedorNombre || x.proveedor || "").toLowerCase() ===
            String((provNameSel?.nombre || "")).toLowerCase();

        const matchProveedor = byProvId || byProvName;

        if (!matchCategoria || !matchProveedor) return false;

        // búsqueda difusa
        if (!qTokens.length) return true;

        const haySubstr = (x._index || "").includes(normalize(q));
        if (haySubstr) return true;

        const s = scoreItem(x, qTokens);
        const minScore = Math.max(2, Math.ceil(qTokens.length * 1.5));
        return s >= minScore;
      })
      .sort((a, b) => {
        if (!qTokens.length) return 0;
        return scoreItem(b, qTokens) - scoreItem(a, qTokens);
      });
  }, [indexed, items, catSel, provSel, categorias, proveedores, qTokens, q]);

  return { filtered, qTokens };
}
