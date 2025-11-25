import React from "react";

export default function SectionDescripcionCondiciones({ form }) {
  const {
    descripcion,
    setDescripcion,
    condiciones,
    setCondiciones,
  } = form;

  return (
    <section className="border border-neutral-800 rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-semibold text-neutral-300">
        Descripción y condiciones
      </h2>

      <div className="space-y-2">
        <label className="text-xs text-neutral-400">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="Describa el beneficio que ofrece..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-neutral-400">Condiciones</label>
        <textarea
          value={condiciones}
          onChange={(e) => setCondiciones(e.target.value)}
          rows={3}
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="Restricciones, términos, requisitos..."
        />
      </div>
    </section>
  );
}
