export function ChipsRow({
  titleAll,
  items,
  selected,
  onSelect,
  rowRef,
}) {
  return (
    <div ref={rowRef} className="flex gap-2 overflow-x-auto pb-1 snap-x -mx-1 px-1">
      <button
        className={`px-4 py-2 rounded-full border ${!selected ? "bg-white/15 border-white/20 text-white" : "bg-transparent border-white/10 text-white/80 hover:text-white"}`}
        onClick={()=>onSelect("")}
      >
        {titleAll}
      </button>

      {items.map((it, i) => {
        const val = it.sel, label = it.label;
        const isActive = !!selected && String(selected).toLowerCase() === String(val).toLowerCase();
        return (
          <button
            key={`${val}-${i}`}
            className={`px-4 py-2 rounded-full border whitespace-nowrap ${
              isActive ? "bg-white/15 border-white/20 text-white"
                       : "bg-transparent border-white/10 text-white/80 hover:text-white"
            }`}
            onClick={()=>onSelect(isActive ? "" : val)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
