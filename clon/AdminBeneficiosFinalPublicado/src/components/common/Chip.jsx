import { cls } from "../../utils/text";
export default function Chip({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={cls(
        "inline-flex items-center gap-2 rounded-full",
        "px-3 py-1 text-sm md:text-[13px] font-medium tracking-tight",
        "border transition-colors duration-150",
        active
          ? "bg-white/10 border-white/30 text-white"
          : "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/8 hover:border-white/20"
      )}>
      <span className={cls("h-1.5 w-1.5 rounded-full", active ? "bg-white" : "bg-white/40")} />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
