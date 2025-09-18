import { useEffect, useState } from "react";

export default function HRPortalOverlay({ src, maximized, onToggle, onClose }) {
  const [key, setKey] = useState(0);
  const boxClass = maximized
    ? "w-screen h-screen rounded-none"
    : "w-[min(1200px,96vw)] h-[min(820px,92vh)] md:rounded-2xl";

  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className={`bg-neutral-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col ${boxClass}`}>
        <div className="h-12 flex items-center gap-2 px-3 border-b border-white/10">
          <div className="font-medium text-white/90">HR Portal</div>
          <div className="ml-auto flex items-center gap-2">
            <button className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm" onClick={()=>setKey(k=>k+1)} title="Refrescar">↻</button>
            <button className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm" onClick={()=>window.open(src,"_blank","noopener")} title="Abrir en pestaña nueva">↗</button>
            <button className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm" onClick={onToggle} title={maximized ? "Contraer" : "Expandir"}>
              {maximized ? "⤢" : "⤡"}
            </button>
            <button className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold" onClick={onClose} title="Cerrar">Cerrar</button>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <iframe key={key} src={src} title="HR Portal" className="w-full h-full" allow="clipboard-read; clipboard-write" />
        </div>
      </div>
    </div>
  );
}
