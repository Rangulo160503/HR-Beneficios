// src/components/BenefitCard.jsx
import { useEffect, useRef, useState } from "react";
import { Api } from "../services/api";
import { extractImage, safeSrc, EMBED_PLACEHOLDER } from "../utils/images";

const imgCache = new Map();

export default function BenefitCard({ item, onClick }) {
  const ref = useRef(null);
  const [imgSrc, setImgSrc] = useState(() => safeSrc(item.imagen));

  useEffect(() => {
    if (!ref.current) return;
    if (imgSrc && imgSrc !== EMBED_PLACEHOLDER) return;

    const id = item.id ?? item.beneficioId ?? item.BeneficioId ?? item.Id;
    if (!id) return;

    if (imgCache.has(id)) {
      setImgSrc(imgCache.get(id));
      return;
    }

    const load = async () => {
      try {
        const d = await Api.beneficios.obtener(id);
        const src = safeSrc(extractImage(d));
        imgCache.set(id, src);
        setImgSrc(src);
      } catch {
        imgCache.set(id, EMBED_PLACEHOLDER);
        setImgSrc(EMBED_PLACEHOLDER);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "250px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [item, imgSrc]);

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-neutral-900 border border-white/10 p-3 cursor-pointer hover:bg-white/5 transition"
      onClick={onClick}
    >
      {/* Imagen + badges */}
      <div className="w-full aspect-[4/3] rounded-xl bg-white/10 overflow-hidden relative">
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover block"
          onError={(e) => { e.currentTarget.src = EMBED_PLACEHOLDER; }}
        />

        {/* Categoría (si existe) */}
        {item.categoria && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 text-white/90 text-[11px] px-2 py-0.5 border border-white/10">
            {item.categoria}
          </span>
        )}

        {/* Descuento (si existe) */}
        {item.descuento && (
          <span className="absolute right-2 top-2 rounded-full bg-emerald-500 text-black text-[11px] px-2 py-0.5 font-semibold">
            {item.descuento}
          </span>
        )}
      </div>

      {/* Detalles generales */}
      <div className="mt-2">
        {/* Proveedor */}
        <div className="text-xs text-white/60 truncate">
          {item.proveedor}
        </div>

        {/* Título */}
        <div
          className="text-sm font-semibold text-white/90 leading-snug mt-0.5"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={item.titulo}
        >
          {item.titulo}
        </div>
      </div>
    </div>
  );
}
