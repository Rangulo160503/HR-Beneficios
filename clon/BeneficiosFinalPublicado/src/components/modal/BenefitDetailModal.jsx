// src/components/modal/BenefitDetailModal.jsx
import { useEffect, useState } from "react";
import { Beneficios } from "../../services/beneficiosService";

// Formateadores
const fmtCRC = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(n)
    : "—";

const fmtDate = (s) =>
  s ? new Date(s).toLocaleDateString("es-CR", { year: "numeric", month: "short", day: "2-digit" }) : "—";

/**
 * Props:
 * - beneficioId: string|number (requerido)
 * - onUse?: (beneficio) => void  (callback al presionar “Usar beneficio”)
 */
export default function BenefitDetailModal({ beneficioId, onUse }) {
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

  if (!beneficioId) return null;

  return (
    <div className="space-y-5 text-white">
      {loading && <div>Cargando…</div>}
      {error && <div className="text-red-400">{error}</div>}

      {!loading && !error && beneficio && (
        <>
          {/* Título */}
          <h3 className="text-xl font-bold">{beneficio.titulo ?? "—"}</h3>

          {/* Imagen o placeholder */}
          <div className="w-full">
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

          {/* Descripción (opcional para el usuario final; puedes quitarla si no la querés) */}
          {beneficio.descripcion && (
            <p className="text-sm text-white/80">{beneficio.descripcion}</p>
          )}

          {/* Detalles requeridos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-semibold">Proveedor: </span>
              {beneficio.proveedorNombre ?? beneficio.proveedorId ?? "—"}
            </div>
            <div>
              <span className="font-semibold">Categoría: </span>
              {beneficio.categoriaNombre ?? beneficio.categoriaId ?? "—"}
            </div>
            <div>
              <span className="font-semibold">Precio: </span>
              {fmtCRC(beneficio.precioCRC)}
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold">Vigencia: </span>
              {fmtDate(beneficio.vigenciaInicio)} → {fmtDate(beneficio.vigenciaFin)}
            </div>
            {beneficio.condiciones && (
              <div className="sm:col-span-2">
                <span className="font-semibold">Condiciones: </span>
                {beneficio.condiciones}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="pt-1">
            <button
              className="rounded-xl bg-white text-black px-4 py-2 hover:opacity-90"
              onClick={() => onUse?.(beneficio)}
            >
              Usar beneficio
            </button>
          </div>
        </>
      )}
    </div>
  );
}
