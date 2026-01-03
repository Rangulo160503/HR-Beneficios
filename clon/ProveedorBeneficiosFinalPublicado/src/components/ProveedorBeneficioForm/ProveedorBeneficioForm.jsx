// src/components/ProveedorBeneficioForm/ProveedorBeneficioForm.jsx
import React from "react";
import useProveedorBeneficioFormState from "./useProveedorBeneficioFormState";
import FormHeader from "./FormHeader";
import SectionDatosPrincipales from "./SectionDatosPrincipales";
import SectionImagen from "./SectionImagen";
import SectionDescripcionCondiciones from "./SectionDescripcionCondiciones";
import SectionVigencia from "./SectionVigencia";

// src/components/ProveedorBeneficioForm/ProveedorBeneficioForm.jsx
// ...
export default function ProveedorBeneficioForm() {
  const form = useProveedorBeneficioFormState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = form.getPayload();
    console.log("Payload proveedor (solo front, sin API aún):", payload);
    alert("Formulario de proveedor listo. Luego lo conectamos al API. 🙂");
  };

  return (
    // ⬇️ sin min-h-screen; responsive en bordes y márgenes
    <div className="w-full max-w-3xl mx-auto bg-neutral-950 border-x-0 border-y border-neutral-800 rounded-none sm:rounded-2xl sm:border">
      <FormHeader onCancel={form.resetForm} />

      <form
        id="form-nuevo-beneficio-proveedor"
        onSubmit={handleSubmit}
        className="px-4 py-5 space-y-6 sm:px-6"
      >
        <SectionDatosPrincipales form={form} />
        <SectionImagen form={form} />
        <SectionDescripcionCondiciones form={form} />
        <SectionVigencia form={form} />
      </form>
    </div>
  );
}

