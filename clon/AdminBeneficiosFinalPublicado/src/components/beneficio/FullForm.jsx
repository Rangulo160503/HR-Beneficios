// src/components/beneficio/FullForm.jsx
import { useState } from "react";

export default function FullForm({ initial = null, onCancel, onSave }) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [precio, setPrecio] = useState(initial?.precioCRC ?? initial?.precio ?? "");

  function submit(e) {
    e.preventDefault();
    onSave?.({ titulo, precioCRC: Number(precio) || 0 });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <form onSubmit={submit}
        className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-white/10 p-4 space-y-3">
        <div className="text-lg font-semibold">
          {initial ? "Editar beneficio" : "Nuevo beneficio"}
        </div>

        <div>
          <label className="text-sm">Título</label>
          <input
            className="w-full rounded-lg bg-neutral-950 border border-white/10 px-3 py-2"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm">Precio (CRC)</label>
          <input
            type="number"
            className="w-full rounded-lg bg-neutral-950 border border-white/10 px-3 py-2"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            min="0"
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-neutral-700 hover:bg-neutral-600 border border-white/10 px-3 py-2 font-semibold"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
