import { useEffect, useRef } from "react";
import Chip from "../common/Chip";

export default function FiltersBar({
  selCat, selProv, setSelCat, setSelProv,
  visibleCats = [], visibleProvs = [],
}) {
  const catsRef = useRef(null);
  const provsRef = useRef(null);

  // Siempre arranca alineado a la izquierda
  useEffect(() => {
    if (catsRef.current) catsRef.current.scrollLeft = 0;
  }, [selCat, visibleCats.length]);

  useEffect(() => {
    if (provsRef.current) provsRef.current.scrollLeft = 0;
  }, [selProv, visibleProvs.length]);

  const rowCls = "chips-row flex gap-2 overflow-x-auto pb-1 px-2 no-scrollbar snap-x";

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Categorías */}
      <div ref={catsRef} className={rowCls} aria-label="Filtros de categorías">
        <Chip active={!selCat} onClick={() => setSelCat("")} label="• Todas las categorías" />
        {visibleCats.map(c => (
          <Chip
            key={`cat-${c.sel ?? c.label ?? c.id}`}
            active={!!selCat && selCat.toLowerCase() === String(c.sel).toLowerCase()}
            onClick={() => setSelCat(selCat === c.sel ? "" : c.sel)}
            label={c.label}
          />
        ))}
      </div>

      {/* Proveedores */}
      <div ref={provsRef} className={rowCls} aria-label="Filtros de proveedores">
        <Chip active={!selProv} onClick={() => setSelProv("")} label="• Todos los proveedores" />
        {visibleProvs.map(p => (
          <Chip
            key={`prov-${p.sel ?? p.label ?? p.id}`}
            active={!!selProv && selProv.toLowerCase() === String(p.sel).toLowerCase()}
            onClick={() => setSelProv(selProv === p.sel ? "" : p.sel)}
            label={p.label}
          />
        ))}
      </div>
    </div>
  );
}
