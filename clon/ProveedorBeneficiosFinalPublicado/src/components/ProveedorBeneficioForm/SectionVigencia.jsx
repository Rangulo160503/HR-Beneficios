import React from "react";

export default function SectionVigencia({ form }) {
  const {
    vigenciaInicio,
    setVigenciaInicio,
    vigenciaFin,
    setVigenciaFin,
  } = form;

  return (
    <section className="border border-neutral-800 rounded-xl p-4 space-y-3">
      <h2 className="text-sm font-semibold text-neutral-300">Vigencia</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs text-neutral-400">Inicio</label>
          <input
            type="date"
            value={vigenciaInicio}
            onChange={(e) => setVigenciaInicio(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-neutral-400">Fin</label>
          <input
            type="date"
            value={vigenciaFin}
            onChange={(e) => setVigenciaFin(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>
    </section>
  );
}
