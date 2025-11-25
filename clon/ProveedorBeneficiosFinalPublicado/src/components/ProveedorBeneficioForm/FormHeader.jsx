import React from "react";

export default function FormHeader({ onCancel }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-1 rounded-full text-sm border border-neutral-700 hover:bg-neutral-800"
      >
        Cancelar
      </button>

      <h1 className="text-lg font-semibold">Nuevo beneficio (Proveedor)</h1>

      <button
        type="submit"
        form="form-nuevo-beneficio-proveedor"
        className="px-4 py-1 rounded-full text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
      >
        Guardar
      </button>
    </div>
  );
}
