// src/components/ProveedorPortal/ProveedorBenefitsList.jsx
import React from "react";

export default function ProveedorBenefitsList({ onNuevo }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">
          Aquí irán los beneficios que este proveedor ha registrado.
        </p>
        <button
          onClick={onNuevo}
          className="px-3 py-1 rounded-full text-xs border border-neutral-700 hover:bg-neutral-900"
        >
          + Nuevo beneficio
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Más adelante: map de beneficios del proveedor */}
        <div className="h-32 rounded-xl border border-dashed border-neutral-700 flex items-center justify-center text-neutral-500 text-xs">
          Sin beneficios aún. Cree el primero con el botón "Nuevo".
        </div>
      </div>
    </div>
  );
}
