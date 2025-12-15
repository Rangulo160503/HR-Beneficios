// src/components/AdminShell/pages/AprobacionesPage.jsx
import { useMemo, useState } from "react";
import { useAprobaciones } from "../../../hooks/useAprobaciones";
import BenefitEditModal from "./BenefitEditModal";

const IconRefresh = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M3 4v6h6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 20v-6h-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 14.5a7 7 0 0 0 11 3.5L20 18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.5 9.5a7 7 0 0 0-11-3.5L4 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AprobacionesPage() {
  const { items, loading, error, selected, selectedId, setSelectedId, refresh, aprobar, rechazar } = useAprobaciones();
  const [processing, setProcessing] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const onAprobar = async () => {
    if (!selected?.id) return;
    setProcessing(true);
    try {
      await aprobar(selected.id);
    } finally {
      setProcessing(false);
    }
  };

  const onRechazar = async () => {
    if (!selected?.id) return;
    const motivo = window.prompt("Motivo del rechazo (opcional):", "");
    setProcessing(true);
    try {
      await rechazar(selected.id, motivo || undefined);
    } finally {
      setProcessing(false);
    }
  };

  const detailRows = useMemo(() => {
    if (!selected) return [];
    return [
      { label: "Proveedor", value: selected.proveedorNombre || "—" },
      { label: "Categoría", value: selected.categoriaNombre || "—" },
      { label: "Precio", value: selected.precioCRC != null ? `₡${selected.precioCRC}` : "—" },
      { label: "Vigencia", value: `${selected.vigenciaInicio?.slice?.(0,10) || "—"} → ${selected.vigenciaFin?.slice?.(0,10) || "—"}` },
      { label: "Condiciones", value: selected.condiciones || "—" },
      { label: "Descripción", value: selected.descripcion || "—" },
    ];
  }, [selected]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/50">Aprobación de beneficios</p>
          <h2 className="text-lg font-semibold">Pendientes de aprobación</h2>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 text-sm hover:bg-white/5"
        >
          <IconRefresh className="w-4 h-4" />
          Recargar
        </button>
      </div>

      <div className="grid md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-4">
        <section className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-white/50">Pendientes</p>
            {error && <span className="text-[11px] text-amber-300/90">Error</span>}
          </div>

          <ul className="divide-y divide-white/5 max-h-[65vh] overflow-y-auto">
            {loading && !error && (
              <>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <li key={idx} className="px-4 py-3 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-md bg-white/5 flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="h-3 rounded bg-white/10 w-2/3" />
                      <div className="h-2 rounded bg-white/5 w-1/2" />
                    </div>
                  </li>
                ))}
              </>
            )}

            {error && !loading && (
              <li className="px-4 py-6 text-xs text-amber-200/90">
                No se pudieron cargar los pendientes.
              </li>
            )}

            {!loading && !error && items.map((b) => {
              const active = b.id === selectedId;
              return (
                <li
                  key={b.id}
                  className={`px-4 py-3 cursor-pointer ${active ? "bg-white/5" : "hover:bg-white/5/60"}`}
                  onClick={() => setSelectedId(b.id)}
                >
                  <p className="text-sm font-medium">{b.titulo || "(Sin título)"}</p>
                  <p className="text-[11px] text-white/50">
                    {(b.proveedorNombre || "Proveedor") + " • " + (b.categoriaNombre || "Categoría")}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1">
                    Creado: {b.fechaCreacion?.slice?.(0, 10) || "—"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="px-2 py-1 rounded-full text-[11px] border border-white/15 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditTarget(b);
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </li>
              );
            })}

            {!loading && !error && items.length === 0 && (
              <li className="px-4 py-6 text-xs text-white/40">No hay beneficios pendientes de aprobación.</li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl bg-black/40 border border-white/10 p-4">
          {!selected && !loading ? (
            <p className="text-sm text-white/50">Selecciona un beneficio pendiente para ver el detalle.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">Detalle</p>
                <h3 className="text-lg font-semibold">{selected?.titulo || "(Sin título)"}</h3>
                <p className="text-[11px] text-white/50">
                  {(selected?.proveedorNombre || "Proveedor") + " • " + (selected?.categoriaNombre || "Categoría")}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                {detailRows.map((row) => (
                  <div key={row.label} className="border border-white/5 rounded-xl px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-white/40">{row.label}</p>
                    <p className="text-sm text-white/90 leading-snug break-words">{row.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onRechazar}
                  disabled={!selected || processing}
                  className="px-4 py-2 rounded-full border border-white/10 text-sm text-white hover:bg-white/5 disabled:opacity-60"
                >
                  Rechazar
                </button>
                <button
                  onClick={onAprobar}
                  disabled={!selected || processing}
                  className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-60"
                >
                  {processing ? "Procesando..." : "Aprobar"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <BenefitEditModal
        open={Boolean(editTarget)}
        benefit={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={async (updated) => {
          setEditTarget(null);
          await refresh();
          if (updated?.id || updated?.beneficioId) {
            setSelectedId(updated.id || updated.beneficioId);
          }
        }}
      />
    </div>
  );
}