import BeneficioEditModal from "../components/BeneficioEditModal";
import useAprobaciones from "../hooks/useAprobaciones";

const formatCRC = (valor) => {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "-";
  return new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(Number(valor));
};

const formatFecha = (valor) => {
  if (!valor) return "-";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return valor;
  return d.toLocaleDateString("es-CR");
};

function AprobacionesPage() {
  const {
    pendientes,
    aprobados,
    seleccionado,
    loading,
    tab,
    setTab,
    seleccionar,
    aprobar,
    rechazar,
    toggleDisponible,
    recargar,
    editandoId,
    abrirEdicion,
    cerrarEdicion,
  } = useAprobaciones();

  const listaActual = tab === "pendientes" ? pendientes : aprobados;
  const tituloLista = tab === "pendientes" ? "PENDIENTES" : "APROBADOS";
  const vacioTexto = tab === "pendientes"
    ? "No hay beneficios pendientes de aprobación."
    : "No hay beneficios aprobados aún.";

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Aprobaciones</h1>
            <p className="text-white/60">Pendientes de aprobación</p>
          </div>
          <button
            onClick={recargar}
            className="px-4 py-2 rounded-full bg-neutral-800 text-sm hover:bg-neutral-700 border border-white/10"
          >
            Recargar
          </button>
        </header>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("pendientes")}
            className={`px-3 py-1 rounded-full text-sm ${
              tab === "pendientes"
                ? "bg-emerald-500 text-black font-semibold"
                : "bg-neutral-800 text-white/70"
            }`}
          >
            Pendientes ({pendientes.length})
          </button>
          <button
            onClick={() => setTab("aprobados")}
            className={`px-3 py-1 rounded-full text-sm ${
              tab === "aprobados"
                ? "bg-emerald-500 text-black font-semibold"
                : "bg-neutral-800 text-white/70"
            }`}
          >
            Aprobados ({aprobados.length})
          </button>
          {loading && <span className="text-xs text-white/50">Actualizando...</span>}
        </div>

        <div className="border border-white/10 bg-black/40 rounded-2xl shadow-xl flex flex-col min-h-[520px]">
          <div className="flex-1 px-6 pb-6 pt-2 grid grid-cols-[minmax(280px,340px)_1fr] gap-4">
            <aside className="space-y-2">
              <div className="text-[11px] uppercase text-white/40 tracking-wide">{tituloLista}</div>
              <div className="bg-neutral-900/70 border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden max-h-[560px]">
                {listaActual.length === 0 && (
                  <div className="p-4 text-sm text-white/60">{vacioTexto}</div>
                )}
                {listaActual.map((b) => {
                  const isActive = seleccionado?.beneficioId === b.beneficioId;
                  return (
                    <button
                      key={b.beneficioId}
                      onClick={() => seleccionar(b)}
                      className={`w-full text-left p-4 hover:bg-white/5 ${
                        isActive ? "bg-white/10" : ""
                      }`}
                    >
                      <div className="font-medium truncate">{b.titulo || "(Sin título)"}</div>
                      <div className="text-xs text-white/60 truncate">
                        {[b.proveedorNombre, b.categoriaNombre].filter(Boolean).join(" · ")}
                      </div>
                      <div className="text-[11px] text-white/40 mt-1">
                        Creado: {formatFecha(b.creadoEl || b.fechaCreacion)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="space-y-4">
              {!seleccionado ? (
                <div className="h-full flex items-center justify-center text-white/60 text-sm border border-white/5 rounded-xl">
                  {vacioTexto}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wide text-white/40">Beneficio</div>
                    <h2 className="text-2xl font-semibold leading-tight">{seleccionado.titulo}</h2>
                    <div className="text-white/60 text-sm">
                      {[seleccionado.proveedorNombre, seleccionado.categoriaNombre]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-white/5 rounded-xl px-4 py-3 text-sm">
                      <div className="text-[11px] uppercase text-white/40 tracking-wide">Proveedor</div>
                      <div className="mt-1 text-white/90">{seleccionado.proveedorNombre || "-"}</div>
                    </div>
                    <div className="border border-white/5 rounded-xl px-4 py-3 text-sm">
                      <div className="text-[11px] uppercase text-white/40 tracking-wide">Categoría</div>
                      <div className="mt-1 text-white/90">{seleccionado.categoriaNombre || "-"}</div>
                    </div>
                    <div className="border border-white/5 rounded-xl px-4 py-3 text-sm">
                      <div className="text-[11px] uppercase text-white/40 tracking-wide">Precio</div>
                      <div className="mt-1 text-white/90">{formatCRC(seleccionado.precioCRC)}</div>
                    </div>
                    <div className="border border-white/5 rounded-xl px-4 py-3 text-sm">
                      <div className="text-[11px] uppercase text-white/40 tracking-wide">Vigencia</div>
                      <div className="mt-1 text-white/90">
                        {[seleccionado.vigenciaInicio, seleccionado.vigenciaFin]
                          .filter(Boolean)
                          .map(formatFecha)
                          .join(" → ") || "-"}
                      </div>
                    </div>
                    <div className="border border-white/5 rounded-xl px-4 py-3 text-sm col-span-2">
                      <div className="text-[11px] uppercase text-white/40 tracking-wide">Condiciones</div>
                      <div className="mt-1 text-white/80 whitespace-pre-wrap leading-relaxed">
                        {seleccionado.condiciones || "-"}
                      </div>
                    </div>
                    <div className="border border-white/5 rounded-xl px-4 py-3 text-sm col-span-2">
                      <div className="text-[11px] uppercase text-white/40 tracking-wide">Descripción</div>
                      <div className="mt-1 text-white/80 whitespace-pre-wrap leading-relaxed">
                        {seleccionado.descripcion || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {tab === "pendientes" ? (
                      <>
                        <button
                          onClick={() => rechazar(seleccionado.beneficioId)}
                          className="px-4 py-2 rounded-full bg-neutral-800 text-sm hover:bg-neutral-700 border border-white/10"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => aprobar(seleccionado.beneficioId)}
                          className="px-4 py-2 rounded-full bg-emerald-500 text-sm text-black font-semibold hover:bg-emerald-400"
                        >
                          Aprobar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleDisponible(seleccionado.beneficioId, !seleccionado.disponible)}
                          className={`px-3 py-2 rounded-full text-sm border border-white/10 ${
                            seleccionado.disponible
                              ? "bg-emerald-500 text-black"
                              : "bg-neutral-700 text-white/80"
                          }`}
                        >
                          {seleccionado.disponible ? "Activo" : "Desactivado"}
                        </button>
                        <button
                          onClick={() => abrirEdicion(seleccionado.beneficioId)}
                          className="px-4 py-2 rounded-full bg-neutral-800 text-sm hover:bg-neutral-700 border border-white/10"
                        >
                          Editar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <BeneficioEditModal
        open={!!editandoId}
        beneficioId={editandoId}
        onClose={cerrarEdicion}
        onSaved={recargar}
      />
    </div>
  );
}

export default AprobacionesPage;