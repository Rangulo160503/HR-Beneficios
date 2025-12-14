// src/components/AdminShell/pages/BenefitsList.jsx
export default function BenefitsList({
  items,
  selectedId,
  onSelect,
  loading,
  error,
  onRetry,
}) {
  return (
    <section className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-white/50">
          Lista de beneficios
        </p>

        {error && (
          <span className="text-[11px] text-amber-300/90">
            Problema al cargar
          </span>
        )}
      </div>

      <ul className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
        {/* 🔄 ESTADO LOADING → skeletons */}
        {loading && !error && (
          <>
            {Array.from({ length: 4 }).map((_, idx) => (
              <li
                key={idx}
                className="px-4 py-3 flex items-center gap-3 animate-pulse"
              >
                <div className="w-10 h-10 rounded-md bg-white/5 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="h-3 rounded bg-white/10 w-2/3" />
                  <div className="h-2 rounded bg-white/5 w-1/2" />
                </div>
                <div className="ml-2 w-10 space-y-1">
                  <div className="h-3 rounded bg-white/10" />
                  <div className="h-2 rounded bg-emerald-800/40" />
                </div>
              </li>
            ))}
          </>
        )}

        {/* ❌ ESTADO ERROR → tarjeta moderna */}
        {error && !loading && (
          <li className="px-4 py-6">
            <div className="rounded-2xl border border-red-500/40 bg-red-900/10 px-4 py-4 text-xs text-red-100 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-300 text-sm">!</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-200 text-sm">
                    No se pudieron cargar los beneficios
                  </p>
                  <p className="text-[11px] text-red-100/80 mt-1">
                    Hubo un error al consultar la API. Puedes intentar de
                    nuevo o revisar la configuración del backend.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full text-[11px] border border-white/10 text-white/70 hover:bg-white/5"
                  onClick={() => onRetry?.()}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </li>
        )}

        {/* ✅ LISTA NORMAL (sin error, sin loading) */}
        {!loading &&
          !error &&
          items.map((b) => {
            const itemId = b?.beneficioId ?? b?.id;
            const isActive = itemId === selectedId;

            return (
              <li
                key={itemId}
                className={`flex items-center px-4 py-3 gap-3 cursor-pointer ${
                  isActive ? "bg-white/5" : "hover:bg-white/5/60"
                }`}
                onClick={() => onSelect?.({ ...b, id: itemId, beneficioId: itemId })}
              >
                {/* mini imagen */}
                <div className="w-10 h-10 rounded-md bg-white/10 overflow-hidden flex-shrink-0" />

                {/* nombre + proveedor / categoría */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {b.titulo || b.nombre}
                  </p>
                  <p className="text-[11px] text-white/50 truncate">
                    {(b.proveedorNombre || b.proveedor || "Proveedor") +
                      " • " +
                      (b.categoriaNombre || b.categoria || "Categoría")}
                  </p>
                </div>

                {/* métrica a la derecha */}
                <div className="ml-2 text-right">
                  <p className="text-xs font-semibold">
                    {b.totalToques ?? 0}
                  </p>
                  <p className="text-[10px] text-emerald-400/80">
                    toques
                  </p>
                </div>
              </li>
            );
          })}

        {/* 🕳️ VACÍO (solo si NO hay error) */}
        {!loading && !error && items.length === 0 && (
          <li className="px-4 py-6 text-xs text-white/40">
            No hay beneficios registrados.
          </li>
        )}
      </ul>
    </section>
  );
}
