import React from "react";

export default function MobileSidebar({ open, current, items, onSelect, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-neutral-950 border-r border-white/10 shadow-2xl">
        <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10">
          <div className="font-semibold text-base">HR Beneficios</div>
          <button className="ml-auto p-2 rounded-lg hover:bg-white/5" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/90"><path d="M6 6l12 12M16 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <nav className="p-2 space-y-1">
          {items.map(i => {
            const active = current === i.key;
            return (
              <button key={i.key} onClick={() => onSelect(i.key)}
                className={`w-full flex items-center gap-3 py-2 rounded-2xl text-left px-3 ${
                  active ? "bg-neutral-800 text-white" : "bg-neutral-900 border border-white/10 hover:bg-neutral-800/70 text-white/90"
                } ${i.level === 1 ? "pl-8" : ""}`}>
                <span className="w-5 h-5 grid place-items-center">{i.icon}</span>
                <span className="font-medium">{i.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
