import { cls } from "../../utils/text";
export default function SubNavItem({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick}
      className={cls("w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition",
        active ? "bg-neutral-800 text-white" : "text-white/85 hover:bg-white/5")}>
      <span className="w-4 h-4 grid place-items-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
