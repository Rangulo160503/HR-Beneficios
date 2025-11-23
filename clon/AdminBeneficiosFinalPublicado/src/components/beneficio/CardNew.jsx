import React from "react";

export default function CardNew({ onClick }) {
  console.log("CardNew mounted", !!onClick);
  return (
    <div role="button" tabIndex={0}
onClick={(e)=>{ e.stopPropagation(); 
    console.log("CardNew click"); 
  onClick?.(); }}
onKeyDown={(e)=>{ if (e.key==='Enter' || e.key===' ') { e.preventDefault(); onClick?.(); }}}
      className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden text-left group focus:outline-none focus:ring-2 focus:ring-white/20"
    >
      <div className="relative">
        <div className="px-3 pt-3">
          <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
            Nuevo
          </span>
        </div>
        <div className="aspect-video bg-neutral-800 grid place-items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border border-dashed border-white/30 grid place-items-center text-white/70">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="mt-2 text-xs text-white/50">Agregar imagen (opcional)</div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="text-sm text-white/70">Crear</div>
        <div className="text-lg font-semibold">Agregar nuevo beneficio</div>
        <div className="text-sm text-transparent select-none">₡ 0</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="px-3 py-2 rounded-lg bg-neutral-800 group-hover:bg-neutral-700 border border-white/10 text-sm font-medium transition">
            Crear
          </span>
          <span className="px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-sm text-white/80">
            Opciones
          </span>
        </div>
      </div>
      </div>
  );
}
