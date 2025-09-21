import { cls } from "../../utils/text";
export default function NavItem({ label, icon, active, collapsed, onClick, title }) {
  return (
    <button onClick={onClick}
      className={cls("w-full flex items-center gap-3 px-3 py-2 rounded-lg",
        active ? "bg-neutral-800 text-white" : "hover:bg-white/10 text-white/90",
        collapsed && "justify-center px-2")}
      title={collapsed ? (title || label) : undefined}>
      <span className="text-lg w-5 h-5 grid place-items-center">{icon}</span>
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}
