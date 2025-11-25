import React from "react";

export default function SectionDatosPrincipales({ form }) {
  const {
    titulo,
    setTitulo,
    precioCRC,
    setPrecioCRC,
    moneda,
    setMoneda,
    categoriaId,
    setCategoriaId,
    categoriasMock,
  } = form;

  return (
    <section className="border border-neutral-800 rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-semibold text-neutral-300">
        Datos principales
      </h2>

      <div className="space-y-2">
        <label className="text-xs text-neutral-400">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="Título del beneficio"
          required
        />
      </div>

      
      {/* ⬇️ antes: grid-cols-3 → ahora: 1 col en mobile, 3 en md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs text-neutral-400">Precio (CRC)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={precioCRC}
            onChange={(e) => setPrecioCRC(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-neutral-400">Moneda</label>
          <select
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="CRC">CRC</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>


      <div className="space-y-2">
        <label className="text-xs text-neutral-400">Categoría</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          required
        >
          <option value="">-- Seleccione --</option>
          {categoriasMock.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
