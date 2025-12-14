// src/components/AdminShell/pages/BenefitDetailPanel.jsx
export default function BenefitDetailPanel({
  benefit,
  touchesSeries,
  range = "1W",
  onRangeChange,
  touchTotal = 0,
  touchError,
  touchLoading = false,
  onRetryTouches,
  mode = "desktop",
  visible = true,
  onClose,
  loading = false,
}) {
  const isMobileSheet = mode === "mobile-sheet";

  // En desktop: si no hay beneficio y no está cargando, mensaje normal
  if (!benefit && !isMobileSheet && !loading) {
    return (
      <section className="rounded-2xl bg-black/40 border border-white/10 px-4 py-6 text-sm text-white/40">
        Selecciona un beneficio para ver el detalle.
      </section>
    );
  }

  // En sheet móvil: si no debe mostrarse, no renderizamos
  if (isMobileSheet && (!visible || (!benefit && !loading))) {
    return null;
  }

  const baseClasses =
    "rounded-t-3xl md:rounded-2xl bg-black/40 border border-white/10 shadow-xl";
  const mobileSheetClasses = isMobileSheet
    ? "fixed inset-x-0 bottom-0 max-h-[70vh] px-4 pt-3 pb-6 z-40 backdrop-blur-md md:hidden"
    : "px-4 py-4";

  const activeRange = range || "1W";
  const totalToques =
    touchTotal ?? touchesSeries?.reduce((ac, p) => ac + (p.count ?? 0), 0) ?? 0;

  const maxCount = Math.max(
    ...(touchesSeries?.map((p) => p.count || 0) ?? [0]),
    0
  );

  const renderSeries = () => {
    if (touchLoading) {
      return <div className="animate-pulse h-full bg-white/5 rounded-2xl" />;
    }

    if (touchError) {
      return (
        <div className="h-full rounded-2xl bg-red-900/20 border border-red-500/30 flex flex-col items-center justify-center gap-2 text-xs">
          <p className="text-red-100">No se pudieron cargar los toques.</p>
          <button
            type="button"
            className="px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/20"
            onClick={onRetryTouches}
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (!touchesSeries || touchesSeries.length === 0) {
      return (
        <div className="h-full rounded-2xl bg-white/5 flex items-center justify-center text-xs text-white/60">
          Sin datos en el rango seleccionado.
        </div>
      );
    }

    return (
      <div className="h-full rounded-2xl bg-emerald-900/30 px-4 py-3 flex items-end gap-2 overflow-x-auto">
        {touchesSeries.map((p) => {
          const altura = maxCount > 0 ? Math.max((p.count / maxCount) * 100, 4) : 4;
          const fecha = new Date(p.date || p.Date || p.Fecha || p.fecha);
          const etiqueta = isNaN(fecha.getTime())
            ? ""
            : fecha.toISOString().slice(5, 10);
          return (
            <div key={`${etiqueta}-${p.count}`} className="flex flex-col items-center gap-1 text-[10px] text-white/70">
              <div
                className="w-7 rounded-full bg-emerald-400/80"
                style={{ height: `${altura}%`, minHeight: "6px" }}
                title={`${etiqueta}: ${p.count}`}
              />
              <span>{etiqueta}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className={`${baseClasses} ${mobileSheetClasses}`}>
      {isMobileSheet && (
        <div className="flex items-center justify-between mb-3">
          <div className="h-1 w-10 bg-white/20 rounded-full mx-auto" />
          {onClose && (
            <button
              className="ml-3 text-xs text-white/60"
              onClick={onClose}
            >
              Cerrar
            </button>
          )}
        </div>
      )}

      {loading && !benefit ? (
        /* SKELETON DEL PANEL */
        <div className="animate-pulse space-y-3">
          <div>
            <div className="h-3 w-24 bg-white/10 rounded mb-2" />
            <div className="h-4 w-40 bg-white/20 rounded mb-1" />
            <div className="h-3 w-32 bg-white/10 rounded" />
          </div>

          <div className="flex gap-2 text-[11px]">
            <div className="h-7 flex-1 bg-white/10 rounded-full" />
            <div className="h-7 flex-1 bg-white/5 rounded-full" />
            <div className="h-7 flex-1 bg-white/5 rounded-full" />
          </div>

          <div className="h-40 md:h-56 rounded-2xl bg-emerald-900/30" />

          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-white/5 rounded-xl" />
            <div className="h-10 bg-white/5 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Encabezado */}
          <div className="mb-3">
            <p className="text-xs uppercase tracking-wide text-white/40">
              Beneficio seleccionado
            </p>
            <h3 className="text-base md:text-lg font-semibold">
              {benefit?.titulo || benefit?.nombre || "—"}
            </h3>
            <p className="text-[11px] text-white/50">
              {(benefit?.proveedorNombre || benefit?.proveedor || "Proveedor") +
                " • " +
                (benefit?.categoriaNombre || benefit?.categoria || "Categoría")}
            </p>
          </div>

          {/* Tabs periodo */}
          <div className="flex items-center gap-2 text-[11px] mb-3">
            {["1W", "1M", "YTD"].map((opt) => (
              <button
                key={opt}
                className={`px-3 py-1 rounded-full ${
                  activeRange === opt
                    ? "bg-white text-black font-medium"
                    : "bg-white/5 text-white/80"
                }`}
                onClick={() => onRangeChange?.(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Área gráfico */}
          <div className="h-40 md:h-56 mb-3">{renderSeries()}</div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <p className="text-white/40">Total toques</p>
              <p className="text-sm font-semibold">{totalToques}</p>
            </div>
            <div>
              <p className="text-white/40">Último período</p>
              <p className="text-sm font-semibold">—</p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
