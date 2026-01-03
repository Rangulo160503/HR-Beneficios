// src/components/Display/DisplayFilters.jsx
import HScroll from "../HScroll";
import ChipsRow from "../ChipsRow";

export default function DisplayFilters({
  loadingFilters,
  categorias,
  proveedores,
  catSel,
  setCatSel,
  provSel,
  setProvSel,
}) {
  return (
    <div className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Categorías */}
        {loadingFilters ? (
          <div className="w-full py-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 px-1 -mx-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={`cat-skel-${i}`}
                  aria-hidden="true"
                  className={[
                    "h-9 rounded-full bg-white/5 border border-white/10 animate-pulse",
                    i % 4 === 0 ? "w-20" : i % 4 === 1 ? "w-24" : i % 4 === 2 ? "w-28" : "w-32",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        ) : (
          <HScroll>
            <ChipsRow
              items={categorias}
              selected={catSel}
              onSelect={setCatSel}
              allLabel="Todas las categorías"
            />
          </HScroll>
        )}

        {/* Proveedores */}
        {loadingFilters ? (
          <div className="w-full py-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 px-1 -mx-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={`prov-skel-${i}`}
                  aria-hidden="true"
                  className={[
                    "h-9 rounded-full bg-white/5 border border-white/10 animate-pulse",
                    i % 4 === 0 ? "w-20" : i % 4 === 1 ? "w-24" : i % 4 === 2 ? "w-28" : "w-32",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        ) : (
          <HScroll>
            <ChipsRow
              items={proveedores}
              selected={provSel}
              onSelect={setProvSel}
              allLabel="Todos los proveedores"
            />
          </HScroll>
        )}
      </div>
    </div>
  );
}
