// src/components/FilterChips.jsx
import React from "react";

function normalizeId(it) {
  const raw =
    it?.id ?? it?.Id ??
    it?.categoriaId ?? it?.CategoriaId ??
    it?.proveedorId ?? it?.ProveedorId ??
    it?.value ?? null;
  return raw != null ? String(raw) : null;
}

function getLabel(it) {
  return (
    it?.titulo ?? it?.Titulo ??
    it?.nombre ?? it?.Nombre ??
    it?.label ?? String(it ?? "")
  );
}

export default function FilterChips({
  items = [],
  selected = null,
  onSelect,
  allLabel = "Todos",
}) {
  const selectedStr = selected == null ? null : String(selected);

  return (
    <div className="mb-4">
      <div className="relative after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-12 after:bg-gradient-to-l after:from-neutral-900 after:to-transparent">
        <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory [-webkit-overflow-scrolling:touch] py-1 pr-6 whitespace-nowrap">
          {/* Opción 'Todos' */}
          <button
            key="__all__"
            onClick={() => onSelect?.(null)}
            className={`px-3 py-1.5 rounded-full text-sm snap-start border
              ${selectedStr === null
                ? "bg-white text-black border-white"
                : "bg-white/10 text-white border-white/10 hover:bg-white/15"}`}
            aria-pressed={selectedStr === null}
          >
            {allLabel}
          </button>

          {items.map((it, idx) => {
            const id = normalizeId(it);
            const label = getLabel(it) || "—";
            // key estable: si no hay id, usa hash simple + idx
            const key = id ?? `__k_${label}_${idx}`;
            const active = id != null && selectedStr === id;

            return (
              <button
                key={key}
                onClick={() => onSelect?.(id)}
                title={label}
                className={`px-3 py-1.5 rounded-full text-sm snap-start border
                  ${active
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/10 hover:bg-white/15"}`}
                aria-pressed={active}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
