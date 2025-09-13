export default function BenefitCard({ item, onClick }) {
  const {
    titulo = "Título del beneficio",
    proveedor = "Proveedor",
    imagen,
    descuento,          // e.g. "-20%" -> va a la derecha
    categoria,          // e.g. "Odontología"
    destacado = false,  // “Destacado”
    // opcional: tags extra
    tags = [],          // e.g. ["Cupon", "Exclusivo", "CDMX"]
  } = item || {};

  // --- LÓGICA ANTI-SATURACIÓN ---
  // izquierda (sobre la imagen) mostramos como máximo 1–2 chips
  const MAX_LEFT = 1; // sube a 2 si quieres
  const leftPool = [
    ...(destacado ? [{ key: "dest", label: "Destacado", className: "bg-amber-400 text-black font-medium" }] : []),
    ...(categoria ? [{ key: "cat", label: categoria, className: "bg-black/60 border border-white/10" }] : []),
    ...tags.map((t, i) => ({ key: `tag${i}`, label: t, className: "bg-black/60 border border-white/10" })),
  ];
  const leftVisible = leftPool.slice(0, MAX_LEFT);
  const leftExtra = Math.max(0, leftPool.length - leftVisible.length);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl bg-white/5 p-2 text-left hover:bg-white/10 transition"
      title={titulo}
    >
      {/* Imagen */}
      <div className="relative w-full rounded-xl overflow-hidden bg-white/10 aspect-[16/9] sm:aspect-square">
        {imagen ? (
          <img src={imagen} alt={titulo} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <span className="text-white/60 text-sm">Sin imagen</span>
          </div>
        )}

        {/* IZQUIERDA: chips visibles + compacto +N */}
        {(leftVisible.length > 0 || leftExtra > 0) && (
          <div className="absolute top-2 left-2 flex items-center gap-2">
            {leftVisible.map((b) => (
              <span
                key={b.key}
                className={`px-2 py-0.5 rounded-full text-[11px] backdrop-blur ${b.className}`}
              >
                {b.label}
              </span>
            ))}
            {leftExtra > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/20 text-white/90 border border-white/10">
                +{leftExtra}
              </span>
            )}
          </div>
        )}

        {/* DERECHA: descuento y botón acción */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {descuento && (
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500 text-black font-semibold">
              {descuento}
            </span>
          )}
          <div className="h-8 w-8 rounded-full bg-black/50 border border-white/10 grid place-items-center">
            <div className="h-3 w-3 rounded bg-white/80" />
          </div>
        </div>
      </div>

      {/* Texto */}
      <div className="mt-2">
        <div className="text-xs text-white/60 truncate">{proveedor}</div>
        <div className="text-sm font-semibold leading-tight line-clamp-2 text-white/90">
          {titulo}
        </div>

        {/* ▼ Variante B (opcional): chips debajo de la imagen, con wrap.
             Descomenta si prefieres no saturar arriba y ver todo abajo. */}
        {/*
        {leftPool.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {leftPool.map((b, idx) => (
              <span
                key={b.key ?? idx}
                className={`px-2 py-0.5 rounded-full text-[11px] ${b.className ?? "bg-white/10"}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
        */}
      </div>
    </button>
  );
}
// Skeleton para usar en Display mientras carga
export function BenefitCardSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-white/5 p-2">
      <div className="w-full rounded-xl overflow-hidden bg-white/10 aspect-[16/9] sm:aspect-square animate-pulse" />
      <div className="mt-2 space-y-2">
        <div className="h-3 w-1/3 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
}
