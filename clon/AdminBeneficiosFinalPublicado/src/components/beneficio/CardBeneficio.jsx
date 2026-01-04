// src/components/beneficio/CardBeneficio.jsx
import React from "react";
import { useBenefitCardImage } from "../../ui/hooks/useBenefitCardImage";

export default function CardBeneficio({ item, onEdit, onDelete }) {
  const { containerRef, src } = useBenefitCardImage(item);

  const precio = item?.precioCRC ?? item?.precio ?? null;

  return (
    <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
      <div className="relative">
        <div className="px-3 pt-3">
  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
    {item?.categoriaNombre || "—"}
  </span>
</div>
        <div
          ref={containerRef}
          className="aspect-video bg-neutral-800 grid place-items-center text-white/50"
        >
          {src ? (
            <img className="w-full h-full object-cover" src={src} alt={item?.titulo || ""} />
          ) : (
            <div>Sin imagen</div>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="text-sm text-white/70">{item?.proveedorNombre || "—"}</div>
        <div className="text-lg font-semibold">{item?.titulo || "Beneficio"}</div>
        <div className="text-sm text-white/60">
          ₡ {precio != null ? Number(precio).toLocaleString("es-CR") : "—"}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-sm font-medium"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
