import { useEffect, useMemo, useState } from "react";
import { Api } from "../../services/api";
import { extractImage, safeSrc, EMBED_PLACEHOLDER } from "./images";

export default function BenefitDetailModal({ selected, onClose }) {
  if (!selected) return null;
  const id = useMemo(
    () => selected.id ?? selected.beneficioId ?? selected.BeneficioId ?? selected.Id,
    [selected]
  );
  const [detail, setDetail] = useState(null);
  const [estado, setEstado] = useState({ loading: true, error: "" });
  const [imagenes, setImagenes] = useState([]);
  const [imgsEstado, setImgsEstado] = useState({ loading: false, error: "" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleBackdropClick = () => onClose?.();
  const stop = (e) => e.stopPropagation();

  useEffect(() => {
    setDetail(null);
    setEstado({ loading: true, error: "" });
    if (!id) {
      setEstado({ loading: false, error: "ID de beneficio no válido." });
      return;
    }
    let alive = true;
    (async () => {
      try {
        const d = await Api.beneficios.obtener(id);
        if (!alive) return;
        setDetail(d || null);
        setEstado({ loading: false, error: "" });
      } catch {
        if (!alive) return;
        setDetail(null);
        setEstado({ loading: false, error: "No se pudo cargar el detalle." });
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    setImagenes([]);
    setImgsEstado({ loading: false, error: "" });
    setActiveIndex(0);
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        setImgsEstado({ loading: true, error: "" });
        const data = await Api.beneficioImagen.obtenerPorBeneficio(id);
        if (!alive) return;
        setImagenes(Array.isArray(data) ? data : []);
        setImgsEstado({ loading: false, error: "" });
      } catch {
        if (!alive) return;
        setImagenes([]);
        setImgsEstado({ loading: false, error: "No se pudieron cargar las imágenes adicionales." });
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const titulo = detail?.titulo ?? detail?.Titulo ?? selected.titulo ?? "Beneficio";
  const proveedorNombre =
    detail?.proveedorNombre ?? detail?.ProveedorNombre ?? selected.proveedor ?? "Proveedor";
  const categoriaNombre =
    detail?.categoriaNombre ?? detail?.CategoriaNombre ?? selected.categoria ?? null;
  const descripcion = detail?.descripcion ?? detail?.Descripcion ?? null;
  const condiciones = detail?.condiciones ?? detail?.Condiciones ?? null;
  const precio = detail?.precioCRC ?? detail?.PrecioCRC ?? null;
  const vigIni = (detail?.vigenciaInicio ?? detail?.VigenciaInicio)?.slice?.(0, 10) ?? null;
  const vigFin = (detail?.vigenciaFin ?? detail?.VigenciaFin)?.slice?.(0, 10) ?? null;
  const imgSrc = extractImage(detail) || extractImage(selected);
  const principal = imgSrc ? safeSrc(imgSrc) : null;
  const extras = (imagenes || [])
    .map((img) => {
      const raw = img?.imagenBase64 ?? img?.imagen ?? img?.url ?? img?.imagenUrl;
      return raw ? safeSrc(raw) : null;
    })
    .filter(Boolean);
  const allImages = [principal, ...extras].filter(Boolean);
  const currentSrc = allImages[activeIndex] || null;
  const finalSrc = currentSrc || EMBED_PLACEHOLDER;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden"
        onClick={stop}
      >
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-base font-semibold">{titulo}</h3>
          <div className="mt-1 text-xs text-white/60">
            {proveedorNombre ?? "—"} {categoriaNombre ? `• ${categoriaNombre}` : ""}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <div className="w-full aspect-[16/9] rounded-xl bg-white/10 overflow-hidden">
              {allImages.length > 0 ? (
                <img
                  key={finalSrc}
                  src={finalSrc}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover block"
                  onError={(e) => {
                    e.currentTarget.src = EMBED_PLACEHOLDER;
                  }}
                />
              ) : (
                <div className="h-full grid place-items-center text-white/60 text-sm">
                  Sin imagen
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {allImages.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border ${
                      idx === activeIndex
                        ? "border-emerald-400 ring-2 ring-emerald-500/60"
                        : "border-white/15 hover:border-emerald-400/70"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = EMBED_PLACEHOLDER;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
            {imgsEstado.loading && (
              <p className="mt-2 text-[11px] text-white/40">Cargando fotos adicionales…</p>
            )}
            {imgsEstado.error && !imgsEstado.loading && (
              <p className="mt-2 text-[11px] text-red-400">{imgsEstado.error}</p>
            )}
          </div>
          {estado.loading && (
            <div className="space-y-2">
              <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
            </div>
          )}
          {estado.error && !estado.loading && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {estado.error}
            </div>
          )}
          {!estado.loading && !estado.error && (
            <>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="flex items-start justify-between gap-3 py-1.5">
                  <span className="text-sm text-white/60">Precio</span>
                  <span className="text-sm text-white/90">
                    {typeof precio === "number"
                      ? `₡ ${precio.toLocaleString("es-CR")}`
                      : precio != null && !Number.isNaN(Number(precio))
                        ? `₡ ${Number(precio).toLocaleString("es-CR")}`
                        : "—"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 py-1.5">
                  <span className="text-sm text-white/60">Vigencia</span>
                  <span className="text-sm text-white/90">
                    {vigIni || vigFin
                      ? `${vigIni ? new Date(vigIni).toLocaleDateString("es-CR", { month: "long", year: "numeric" }) : "—"} – ${vigFin ? new Date(vigFin).toLocaleDateString("es-CR", { month: "long", year: "numeric" }) : "—"}`
                      : "—"}
                  </span>
                </div>
              </div>
              {selected.descuento && (
                <span className="inline-block px-2 py-1 rounded bg-emerald-500 text-black text-xs font-semibold">
                  {selected.descuento}
                </span>
              )}
              {descripcion && (
                <details className="rounded-xl bg-white/5 p-3">
                  <summary className="cursor-pointer text-sm font-semibold select-none">
                    Descripción
                  </summary>
                  <div className="mt-2 text-sm text-white/90 whitespace-pre-wrap">{descripcion}</div>
                </details>
              )}
              {condiciones && (
                <details className="rounded-xl bg-white/5 p-3">
                  <summary className="cursor-pointer text-sm font-semibold select-none">
                    Condiciones
                  </summary>
                  <div className="mt-2 text-sm text-white/90 whitespace-pre-wrap">{condiciones}</div>
                </details>
              )}
            </>
          )}
        </div>
        <div className="px-4 py-3 border-t border-white/10 flex justify-end" />
      </div>
    </div>
  );
}
