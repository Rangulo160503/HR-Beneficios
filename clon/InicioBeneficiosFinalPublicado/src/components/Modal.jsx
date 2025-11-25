// src/components/Modal.jsx
import { useEffect, useRef, useState } from "react";

const ANIM_MS = 220; // duración animación (ms)

export default function Modal({ open, title, onClose, children }) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const timerRef = useRef(null);

  // Monta/desmonta con animación
  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      setClosing(true);
      timerRef.current = setTimeout(() => setMounted(false), ANIM_MS);
    }
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [open, mounted]);

  // Evita scroll del body detrás del modal
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // Cerrar con ESC
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted]);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    timerRef.current = setTimeout(() => {
      setMounted(false);
      onClose?.();
    }, ANIM_MS);
  };

  if (!mounted) return null;

  // Clases de animación (entrada/salida)
  const backdropBase = "absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity";
  const sheetBase = `
    relative z-10 w-full sm:max-w-4xl bg-neutral-900 text-white shadow-xl
    sm:rounded-2xl mt-auto sm:mt-0 rounded-t-2xl sm:rounded-2xl
    transition-transform transition-opacity
  `;
  const sheetEnter = "opacity-100 translate-y-0 sm:translate-y-0";
  const sheetExit = "opacity-0 translate-y-4 sm:translate-y-0";
  const backdropEnter = "opacity-100";
  const backdropExit = "opacity-0";

  const animStyle = { transitionDuration: `${ANIM_MS}ms`, paddingBottom: "env(safe-area-inset-bottom)" };

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className={`${backdropBase} ${closing ? backdropExit : backdropEnter}`}
        style={{ transitionDuration: `${ANIM_MS}ms` }}
        onClick={handleClose}
      />
      {/* Contenedor: bottom-sheet en móvil, centrado en sm+ */}
      <div
        className={`${sheetBase} ${closing ? sheetExit : sheetEnter}`}
        style={animStyle}
        role="dialog"
        aria-modal="true"
      >
        {/* Handle visual (solo móvil) */}
        <div className="mx-auto mt-2 mb-1 h-1.5 w-10 rounded-full bg-white/20 sm:hidden" />

        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sticky top-0 bg-neutral-900/95 backdrop-blur">
          <h3 className="text-base font-semibold">{title}</h3>
          
        </header>

        <div className="max-h-[80vh] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
