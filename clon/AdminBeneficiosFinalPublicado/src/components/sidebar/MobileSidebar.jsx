import React, { useEffect, useRef } from "react";

export default function MobileSidebar({ open, current, items, onSelect, onClose }) {
  const panelRef = useRef(null);

  // Cerrar con ESC y bloquear scroll del body
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      {/* overlay */}
      <button
        className="absolute inset-0 bg-black/60"
        aria-label="Cerrar menú"
        onClick={onClose}
      />
      {/* panel */}
      <div
        ref={panelRef}
        className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px]
                   bg-neutral-950 border-r border-white/10 shadow-2xl
                   translate-x-0 animate-[slideIn_.18s_ease-out]"
      >
        {/* header */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10">
          <div className="font-semibold text-base">HR Beneficios</div>
          <button className="ml-auto p-2 rounded-lg hover:bg-white/5" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/90">
              <path d="M6 6l12 12M16 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* nav */}
        <nav className="p-2 space-y-1">
          {items.map((i) => {
            const active = current === i.key;

            // Ítem especial: HR Portal abre enlace externo
            if (i.key === "hrportal") {
              return (
                <a
                  key={i.key}
                  href={i.href ?? "http://hrportal"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div
                    className={`w-full flex items-center gap-3 py-2 rounded-2xl px-3
                               ${active
                                 ? "bg-neutral-800 text-white"
                                 : "bg-neutral-900 border border-white/10 hover:bg-neutral-800/70 text-white/90"}`}
                  >
                    <span className="w-5 h-5 grid place-items-center">{i.icon}</span>
                    <span className="font-medium">{i.label}</span>
                  </div>
                </a>
              );
            }

            // Ítems normales (beneficios, categorías, proveedores…)
            return (
              <button
                key={i.key}
                onClick={() => { onSelect?.(i.key); onClose?.(); }}
                className={`w-full flex items-center gap-3 py-2 rounded-2xl px-3 text-left
                           ${active
                             ? "bg-neutral-800 text-white"
                             : "bg-neutral-900 border border-white/10 hover:bg-neutral-800/70 text-white/90"}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="w-5 h-5 grid place-items-center">{i.icon}</span>
                <span className="font-medium">{i.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Animación (Tailwind keyframes inline) */}
      <style>{`
        @keyframes slideIn { from { transform: translateX(-8%); opacity: .7; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
