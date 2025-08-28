// src/components/Modal.jsx
import { useEffect } from "react";

export default function Modal({ open, title, onClose, children }) {
  // Evita que la página detrás haga scroll cuando el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    // Todo el overlay puede scrollear en móviles
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Capa oscura */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Contenedor centrado; en móvil pega abajo como sheet */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-2 sm:p-6">
        <div
          className="relative w-full sm:max-w-4xl border border-white/10 bg-neutral-900 text-white shadow-xl sm:rounded-2xl rounded-none"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sticky top-0 bg-neutral-900/95 backdrop-blur">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/15">Cerrar</button>
          </header>

          {/* Área con scroll interno, altura máxima para móviles */}
          <div className="max-h-[85vh] overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
