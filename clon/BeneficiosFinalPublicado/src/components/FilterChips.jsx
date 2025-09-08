// src/components/FilterChips.jsx
export default function FilterChips({ items, selected, onSelect, allLabel }) {
  return (
    <div className="mb-4">
      <div
        className="
          relative
          after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-12
          after:bg-gradient-to-l after:from-neutral-900 after:to-transparent
        "
      >
        <div
          className="
            flex gap-2 overflow-x-auto no-scrollbar
            snap-x snap-mandatory
            [-webkit-overflow-scrolling:touch] scroll-pt-2
            py-1 pr-6
            whitespace-nowrap
          "
        >
          <button
            onClick={() => onSelect(null)}
            className={`px-3 py-1.5 rounded-full text-sm snap-start ${
              !selected ? "bg-emerald-500 text-black" : "bg-white/10"
            }`}
          >
            {allLabel}
          </button>

          {items.map((it) => {
            const id = it.id ?? it.Id;
            const nombre = it.titulo ?? it.Titulo ?? it.nombre ?? it.Nombre;
            const active = String(selected) === String(id);
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`px-3 py-1.5 rounded-full text-sm snap-start ${
                  active ? "bg-emerald-500 text-black" : "bg-white/10"
                }`}
              >
                {nombre}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
