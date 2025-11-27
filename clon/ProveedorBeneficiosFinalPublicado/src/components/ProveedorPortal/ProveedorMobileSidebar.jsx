import React, { useEffect, useRef } from "react";

/* ==== ICONOS IGUALES A LOS DEL SIDEBAR PROVEEDOR ==== */

const IconBenefit = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="3" y="7" width="18" height="14" rx="2" strokeWidth="1.8" />
    <path d="M3 11h18M12 7v14" strokeWidth="1.8" />
    <circle cx="12" cy="5" r="2.5" strokeWidth="1.8" />
  </svg>
);

const IconUser = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
    <path
      d="M4 20c0-4 3.5-7 8-7s8 3 8 7"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconHelp = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
    <path
      d="M9.75 9.75a2.25 2.25 0 1 1 3.07 2.07c-.69.28-1.07.97-1.07 1.68v.5"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

/* ================================================== */

// MISMO API QUE EL DEL ADMIN: open, current, onSelect, onClose
export default function ProveedorMobileSidebar({
  open,
  current,
  onSelect,
  onClose,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  // items fijos del portal proveedor
  const items = [
    { key: "beneficios", label: "Beneficios", icon: <IconBenefit className="w-5 h-5" /> },
    { key: "perfil", label: "Perfil", icon: <IconUser className="w-5 h-5" /> },
    { key: "ayuda", label: "Ayuda", icon: <IconHelp className="w-5 h-5" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* overlay igual que admin */}
      <button
        className="absolute inset-0 bg-black/60"
        aria-label="Cerrar menú"
        onClick={onClose}
      />

      {/* panel izquierdo, misma animación que admin */}
      <div
        ref={panelRef}
        className="absolute left-0 top-0 bottom-0 w-[82%] max-w-[340px]
                   bg-neutral-950 border-r border-white/10 shadow-2xl
                   translate-x-0 animate-[slideIn_.18s_ease-out]"
      >
        {/* header */}
        <div className="h-14 flex items-center px-4 ">
          <span className="text-sm font-semibold tracking-wide">
            Portal proveedor
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

            return (
              <button
                key={i.key}
                onClick={() => {
                  onSelect?.(i.key);
                  onClose?.();
                }}
                className={rowClasses}
              >
                <span className={iconClasses}>{i.icon}</span>
                <span className={labelClasses}>{i.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* misma keyframe que admin */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-8%); opacity: .7; }
          to   { transform: translateX(0);   opacity: 1;  }
        }
      `}</style>
    </div>
  );
}
