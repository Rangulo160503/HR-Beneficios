import { cls } from "../../utils/text";
export default function Alert({ tone="info", message, IconInfo, IconError }) {
  const isError = tone === "error";
  return (
    <div className={cls(
      "rounded-xl border px-3 py-2 flex items-center gap-2",
      isError ? "border-red-500/30 bg-red-500/[0.08] text-red-200"
              : "border-white/10 bg-white/5 text-white/90"
    )}>
      <span className="w-5 h-5">
        {isError ? <IconError className="w-5 h-5" /> : <IconInfo className="w-5 h-5" />}
      </span>
      <span className="text-sm">{message}</span>
    </div>
  );
}
