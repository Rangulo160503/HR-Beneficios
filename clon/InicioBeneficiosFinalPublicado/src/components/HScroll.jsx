// src/components/HScroll.jsx
import { useEffect, useRef, useState, Children, cloneElement } from "react";

export default function HScroll({
  children,
  className = "",
  maskWidth = 36,
  step, // si no se pasa, se calcula dinámico
}) {
  const ref = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();

    const onScroll = () => update();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(update);
    ro.observe(el);

    const onWin = () => update();
    window.addEventListener("resize", onWin);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", onWin);
    };
  }, []);

  // Rueda → X (en desktop); en móvil el scroll táctil funciona nativo
  const onWheel = (e) => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth) return;
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      el.scrollBy({ left: e.deltaY, behavior: "auto" });
      e.preventDefault();
    }
  };

  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    const px = step ?? Math.max(240, Math.floor(el.clientWidth * 0.8)); // móvil-friendly
    el.scrollBy({ left: dir * px, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`} onWheel={onWheel}>
      {/* pista */}
      <div
        ref={ref}
        className="
          flex gap-3 overflow-x-auto no-scrollbar py-2 whitespace-nowrap select-none
          snap-x snap-mandatory
        "
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          touchAction: "pan-x",
          // sin padding lateral para NO dejar huecos
        }}
      >
        {/*
          Envolvemos cada hijo para dar snap-start sin exigir cambios al caller.
          Si tus chips ya tienen snap-start, igual funciona.
        */}
        {Children.map(children, (child, i) => (
          <div className="snap-start">{child}</div>
        ))}
      </div>

      {/* fades laterales (overlays, no ocupan espacio) */}
      {canLeft && (
        <div
          className="pointer-events-none absolute left-0 top-0 h-full"
          style={{
            width: maskWidth,
            background: "linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0))",
          }}
        />
      )}
      {canRight && (
        <div
          className="pointer-events-none absolute right-0 top-0 h-full"
          style={{
            width: maskWidth,
            background: "linear-gradient(to left, rgba(0,0,0,0.95), rgba(0,0,0,0))",
          }}
        />
      )}

      {/* sombra local bajo la flecha (separa visualmente chip ↔ flecha) */}
      {canLeft && (
        <div
          className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 h-8"
          style={{
            width: 40,
            background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))",
            borderRadius: 9999,
            filter: "blur(6px)",
          }}
        />
      )}
      {canRight && (
        <div
          className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 h-8"
          style={{
            width: 40,
            background: "linear-gradient(to left, rgba(0,0,0,0.6), rgba(0,0,0,0))",
            borderRadius: 9999,
            filter: "blur(6px)",
          }}
        />
      )}

      {/* flechas (ocúltalas en móvil si querés con: 'hidden sm:grid') */}
      {canLeft && (
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Desplazar a la izquierda"
          className="
            absolute left-1 top-1/2 -translate-y-1/2
            h-8 w-8 grid place-items-center rounded-full
            bg-white/90 text-black hover:bg-white shadow-md active:scale-95
          "
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
      )}
      {canRight && (
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Desplazar a la derecha"
          className="
            absolute right-1 top-1/2 -translate-y-1/2
            h-8 w-8 grid place-items-center rounded-full
            bg-white/90 text-black hover:bg-white shadow-md active:scale-95
          "
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </button>
      )}
    </div>
  );
}
