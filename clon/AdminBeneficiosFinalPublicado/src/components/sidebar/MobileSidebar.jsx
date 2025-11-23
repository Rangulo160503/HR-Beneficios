import React, { useEffect, useRef } from "react";

/* ==== ICONOS IGUALES A LOS DEL SIDEBAR DESKTOP ==== */

const IconGift = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="1.8" />
    <path d="M12 8v13M3 12h18" strokeWidth="1.8" />
  </svg>
);

const IconTag = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path
      d="M20 13.5 10.5 4H5v5.5L14.5 19a2.1 2.1 0 0 0 3 0L20 16.5a2.1 2.1 0 0 0 0-3z"
      strokeWidth="1.8"
    />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);

const IconBuilding = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.8" />
    <path
      d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M4 19h16"
      strokeWidth="1.8"
    />
  </svg>
);

const IconHandshake = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path
      d="M3 12l3-3 3 3 3-3 3 3 3-3 3 3"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12v5a2 2 0 0 0 2 2h2m12-7v5a2 2 0 0 1-2 2h-2"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/* ================================================== */

export default function MobileSidebar({ open, current, items, onSelect, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
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
        className="absolute left-0 top-0 bottom-0 w-[82%] max-w-[340px]
                   bg-neutral-950 border-r border-white/10 shadow-2xl
                   translate-x-0 animate-[slideIn_.18s_ease-out]"
      >
        {/* header */}
        <div className="h-14 flex items-center px-4 ">
          <span className="text-sm font-semibold tracking-wide">
            HR Beneficios
          </span>

          <button
            className="ml-auto p-2 rounded-lg hover:bg-white/5"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/80">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* nav */}
        <nav className="py-2">
          {items.map((i) => {
            const active = current === i.key;

            // Elegimos el icono según la key, igual que en el sidebar desktop
            let iconNode = null;
            if (i.key === "beneficios") {
              iconNode = <IconGift className="w-5 h-5" />;
            } else if (i.key === "categorias") {
              iconNode = <IconTag className="w-5 h-5" />;
            } else if (i.key === "proveedores") {
              iconNode = <IconHandshake className="w-5 h-5" />;
            } else if (i.key === "hrportal") {
              iconNode = <IconBuilding className="w-5 h-5" />;
            }

            const rowClasses = `
              w-full flex items-center gap-4 px-4 py-3
              ${active ? "bg-neutral-900" : "hover:bg-neutral-900/70"}
            `;

            const iconClasses = `
              ${active ? "text-emerald-300" : "text-white/70"}
            `;

            const labelClasses = `
              text-sm font-medium
              ${active ? "text-white" : "text-white/90"}
            `;

            const content = (
              <>
                {iconNode && <span className={iconClasses}>{iconNode}</span>}
                <span className={labelClasses}>{i.label}</span>
                {i.key === "hrportal" && (
                  <span className="ml-auto text-xs text-white/40"></span>
                )}
              </>
            );

            if (i.key === "hrportal") {
              // Enlace externo
              return (
                <a
                  key={i.key}
                  href={i.href ?? "http://hrportal"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className={rowClasses}>{content}</div>
                </a>
              );
            }

            // Ítems normales
            return (
              <button
                key={i.key}
                onClick={() => { onSelect?.(i.key); onClose?.(); }}
                className={rowClasses}
              >
                {content}
              </button>
            );
          })}
        </nav>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-8%); opacity: .7; }
          to   { transform: translateX(0);   opacity: 1;  }
        }
      `}</style>
    </div>
  );
}
