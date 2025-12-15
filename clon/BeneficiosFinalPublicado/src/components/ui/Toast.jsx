import { useEffect } from "react";

export default function Toast({ open, message, duration = 3500, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-4 z-[1100] -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-lg bg-emerald-700 px-4 py-3 text-white shadow-xl shadow-emerald-900/30">
        <span className="text-xl" aria-hidden>
          ✓
        </span>
        <div className="text-sm leading-snug">
          {message.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
