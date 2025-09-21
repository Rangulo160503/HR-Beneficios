export default function Alert({ tone = "info", children }) {
  const isError = tone === "error";
  const cls = (...a) => a.filter(Boolean).join(" ");
  return (
    <div
      className={cls(
        "rounded-xl border px-3 py-2 text-sm flex items-center gap-2",
        isError
          ? "border-red-500/30 bg-red-500/10 text-red-200"
          : "border-white/10 bg-white/5 text-white/90"
      )}
    >
      {children}
    </div>
  );
}
