// src/components/modal/BenefitDetailModal.jsx
import { useEffect, useState, useMemo } from "react";
import { Beneficios } from "../../services/beneficiosService";

const fmtCRC = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(n)
    : "—";

const fmtDate = (s) =>
  s ? new Date(s).toLocaleDateString("es-CR", { year: "numeric", month: "short", day: "2-digit" }) : "—";

const Chip = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`} >
    {children}
  </span>
);

export default function BenefitDetailModal({ beneficioId }) {
  const [beneficio, setBeneficio] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!beneficioId) return;
    let alive = true;
    setLoading(true); setError(""); setBeneficio(null);

    Beneficios.obtener(beneficioId)
      .then((data) => alive && setBeneficio(data))
      .catch((err) => alive && setError(err.message || "Error al cargar beneficio"))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [beneficioId]);

  const chips = useMemo(() => {
    if (!beneficio) return null;
    const esVigente = beneficio.esVigente === true;
    return (
      <div className="flex flex-wrap gap-2">
        <Chip className={`border ${esVigente ? "border-green-400 text-green-300 bg-green-400/10" : "border-yellow-400 text-yellow-300 bg-yellow-400/10"}`}>
          {esVigente ? "Vigente" : "No vigente"}
        </Chip>
        <Chip className="border border-sky-400 text-sky-300 bg-sky-400/10">
          Estado: {beneficio.estado ?? "—"}
        </Chip>
        <Chip className="border border-purple-400 text-purple-300 bg-purple-400/10">
          Origen: {beneficio.origen ?? "—"}
        </Chip>
        {beneficio.disponible !== undefined && (
          <Chip className={`border ${beneficio.disponible ? "border-emerald-400 text-emerald-300 bg-emerald-400/10" : "border-zinc-400 text-zinc-300 bg-zinc-400/10"}`}>
            {beneficio.disponible ? "Disponible" : "No disponible"}
          </Chip>
        )}
      </div>
    );
  }, [beneficio]);

  if (!beneficioId) return null;

  return (
    <div className="space-y-5 text-white">
      {loading && <div>Cargando…</div>}
      {error && <div className="text-red-400">{error}</div>}

      {!loading && !error && beneficio && (
        <>
          {/* Encabezado */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{beneficio.titulo ?? "—"}</h3>
            {chips}
          </div>

          {/* Media + Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              {beneficio.imagenUrl ? (
                <img
                  src={beneficio.imagenUrl}
                  alt={beneficio.titulo}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-xl bg-white/10 text-white/60">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-3">
              <p className="text-sm text-white/80">{beneficio.descripcion ?? "—"}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold">Proveedor: </span>{beneficio.proveedorNombre ?? beneficio.proveedorId ?? "—"}</div>
                <div><span className="font-semibold">Categoría: </span>{beneficio.categoriaNombre ?? beneficio.categoriaId ?? "—"}</div>
                <div><span className="font-semibold">Precio: </span>{fmtCRC(beneficio.precioCRC)}</div>
                <div><span className="font-semibold">Beneficio ID: </span><span className="font-mono">{beneficio.beneficioId ?? "—"}</span></div>

                <div className="col-span-2"><span className="font-semibold">Vigencia: </span>{fmtDate(beneficio.vigenciaInicio)} → {fmtDate(beneficio.vigenciaFin)}</div>
                {beneficio.condiciones && (
                  <div className="col-span-2">
                    <span className="font-semibold">Condiciones: </span>{beneficio.condiciones}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* CTA opcional */}
          <div className="pt-1">
            <button className="rounded-xl bg-white text-black px-4 py-2 hover:opacity-90">
              Usar beneficio
            </button>
          </div>
        </>
      )}
    </div>
  );
}
