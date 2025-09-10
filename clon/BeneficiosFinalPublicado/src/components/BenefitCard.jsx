// src/components/BenefitCard.jsx
import { useEffect, useRef, useState } from "react";
import { Api } from "../services/api";

// Cachés
const IMG_CACHE = new Map();  // id -> src string
const INFLIGHT = new Map();   // id -> Promise<string>

// Normaliza URL/base64/byte[]
function normalizeImage(img) {
  if (!img) return "";
  if (typeof img === "string") {
    const s = img.trim();
    if (!s) return "";
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("blob:")) return s;
    const looksLikeB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
    if (looksLikeB64) return `data:image/jpeg;base64,${s.replace(/\s/g, "")}`;
    if (s.startsWith("/")) return s;
    return s;
  }
  if (Array.isArray(img)) {
    try {
      const u = new Uint8Array(img);
      let bin = "";
      for (let i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]);
      return `data:image/jpeg;base64,${btoa(bin)}`;
    } catch { return ""; }
  }
  return "";
}

// Hook visibilidad
function useOnScreen(ref, rootMargin = "150px") {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return on;
}

export default function BenefitCard({ item, onClick }) {
  const { id, titulo, proveedor, imagen, hasRealImg } = item;
  const [src, setSrc] = useState(imagen || "");
  const ref = useRef(null);
  const onScreen = useOnScreen(ref);

  useEffect(() => {
    // Si el listado trajo imagen real, o ya hay caché → no pedimos nada
    if (hasRealImg) return;
    if (IMG_CACHE.has(id)) {
      setSrc(IMG_CACHE.get(id));
      return;
    }
    // Solo cuando se ve en pantalla
    if (!onScreen) return;

    // Evitar duplicados en vuelo
    if (INFLIGHT.has(id)) {
      INFLIGHT.get(id).then((s) => { if (s) setSrc(s); }).catch(() => {});
      return;
    }

    const p = (async () => {
      try {
        const d = await Api.beneficios.obtener(id);
        const raw = d?.imagen ?? d?.Imagen ?? d?.imagenUrl ?? d?.ImagenUrl ?? null;
        const s = normalizeImage(raw);
        if (s) {
          IMG_CACHE.set(id, s);
          setSrc(s);
        }
        return s;
      } catch {
        return "";
      } finally {
        INFLIGHT.delete(id);
      }
    })();

    INFLIGHT.set(id, p);
  }, [id, hasRealImg, onScreen]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-white/5 p-2 text-left hover:bg-white/10 transition"
      title={titulo}
    >
      <div className="aspect-square w-full rounded-xl overflow-hidden bg-white/10 grid place-items-center">
        {src ? (
          <img src={src} alt={titulo} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <span className="text-white/60 text-sm">Sin imagen</span>
        )}
      </div>
      <div className="mt-2">
        <div className="text-xs text-white/60 truncate">{proveedor || " "}</div>
        <div className="text-sm font-semibold leading-tight line-clamp-2">{titulo}</div>
      </div>
    </button>
  );
}
