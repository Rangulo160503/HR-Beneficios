import { cls } from "../../utils/text";
// src/components/sidebar/NavItem.jsx
export default function NavItem({
  label,
  icon,
  active,
  collapsed,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full flex items-center gap-3 px-3 py-2 text-sm
        rounded-xl transition-colors
        ${active
          ? "bg-neutral-900 text-white"
          : "text-white/70 hover:bg-neutral-900/70"}
      `}
    >
      

      {/* icono (aprovechamos los mismos del Sidebar/MobileSidebar) */}
      <span
        className={`
          w-5 h-5 grid place-items-center flex-shrink-0
          ${active ? "text-emerald-400" : "text-white/80"}
        `}
      >
        {icon}
      </span>

      {/* texto – se oculta cuando el sidebar está colapsado */}
      {!collapsed && (
        <span className="truncate">
          {label}
        </span>
      )}
    </button>
  );
}
