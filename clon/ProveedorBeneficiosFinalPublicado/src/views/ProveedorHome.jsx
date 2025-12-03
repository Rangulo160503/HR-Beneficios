import { useState } from "react";
import ProveedorBeneficioForm from "../proveedor/components/ProveedorBeneficioForm";

export default function ProveedorHome() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Portal de Proveedor</h1>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full px-4 py-2 bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
          >
            Nuevo beneficio
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-neutral-200">
          <p className="text-sm text-neutral-400">
            Aquí podrás crear y editar beneficios asociados a tu proveedor. Usa el botón superior para abrir el formulario.
          </p>
        </div>
      </div>

      {showForm && (
        <ProveedorBeneficioForm
          providerId="00000000-0000-0000-0000-000000000001"
          initial={null}
          onSaved={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}