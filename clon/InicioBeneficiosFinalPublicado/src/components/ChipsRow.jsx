// src/components/ChipsRow.jsx
import HScroll from "./HScroll";

export default function ChipsRow({
  items = [],
  selected = null,
  onSelect = () => {},
  allLabel = "Todos",
  className = "",
}) {
  return (
    <HScroll className={className}>
      {/* “Todos” */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`
          px-4 py-2 rounded-2xl text-sm font-medium border
          ${selected == null
            ? "bg-white text-black border-white"
            : "bg-white/10 text-white/90 border-white/10 hover:bg-white/15"}
        `}
      >
        {allLabel}
      </button>

      {/* Chips */}
      {items.map((it) => {
        const active = String(selected) === String(it.id);
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it.id)}
            className={`
              px-4 py-2 rounded-2xl text-sm font-medium border
              ${active
                ? "bg-white text-black border-white"
                : "bg-white/10 text-white/90 border-white/10 hover:bg-white/15"}
            `}
            title={it.nombre}
          >
            {it.nombre}
          </button>
        );
      })}
    </HScroll>
  );
}
