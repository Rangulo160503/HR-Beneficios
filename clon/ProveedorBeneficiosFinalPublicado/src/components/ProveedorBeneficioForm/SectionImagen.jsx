import React from "react";

export default function SectionImagen({ form }) {
  const { imagenPreview, errorImagen, handleImagenChange } = form;

  const onFileChange = (e) => {
    const file = e.target.files[0];
    handleImagenChange(file);
  };

  return (
    <section className="border border-neutral-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-300">Imagen</h2>
        <span className="text-[11px] text-neutral-500">
          Máx. 1 MB – formato JPG/PNG
        </span>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="text-xs text-neutral-300"
      />

      {errorImagen && (
        <p className="text-xs text-red-400">{errorImagen}</p>
      )}

      <div className="mt-3 h-52 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center overflow-hidden">
        {imagenPreview ? (
          <img
            src={imagenPreview}
            alt="Vista previa"
            className="object-contain max-h-full"
          />
        ) : (
          <span className="text-xs text-neutral-500">
            Sin imagen seleccionada
          </span>
        )}
      </div>
    </section>
  );
}
