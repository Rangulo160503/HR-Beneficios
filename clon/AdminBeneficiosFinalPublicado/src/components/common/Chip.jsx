// src/components/common/Chip.jsx
export default function Chip({
  label,
  active = false,
  onClick,
  title,            // opcional
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      aria-pressed={active}
      className={[
        // base
        "inline-flex items-center gap-1 rounded-full border text-xs font-medium",
        "px-3 py-1.5 transition select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        "whitespace-nowrap flex-shrink-0 snap-start",
        // estilos
        active
          ? "bg-white text-black border-white shadow"
          : "bg-neutral-900 border-white/10 text-white/90 hover:bg-white/10",
        className,
      ].join(" ")}
    >
      {label}
    </button>
  );
}
