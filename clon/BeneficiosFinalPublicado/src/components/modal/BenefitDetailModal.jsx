// src/components/modal/BenefitDetailModal.jsx
import { useEffect, useState } from "react";
import { Api } from "../../services/api.js";

function Line({ label, children }) {
  if (!children && children !== 0) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm text-white/90 text-right">{children}</span>
    </div>
  );
}

function Section({ title, children, defaultOpen = true }) {
  return (
    <details open={defaultOpen} className="rounded-xl bg-white/5 p-3">
      <summary className="cursor-pointer text-sm font-semibold select-none">
        {title}
      </summary>
      <div className="mt-2 text-sm text-white/90">{children}</div>
    </details>
  );
}

export default function BenefitDetailModal({ beneficioId }) {
  const [data, setData] = useState(null);
  const [estado, setEstado] = useState({ loading: true, error: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setEstado({ loading: true, error: "" });
        const d = await Api.beneficios.obtener(beneficioId);
        if (!alive) return;
        setData(d || null);
        setEstado({ loading: false, error: "" });
      } catch (e) {
        if (!alive) return;
        setEstado({ loading: false, error: "No se pudo cargar el detalle." });
      }
    })();
    return () => { alive = false; };
  }, [beneficioId]);

  if (estado.loading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-2/3 rounded bg-white/10 animate-pulse" />
        <div className="aspect-[16/9] w-full rounded-lg bg-white/10 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (estado.error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
        {estado.error}
      </div>
    );
  }

  if (!data) return null;

  const titulo = data.titulo ?? data.Titulo;
  const descripcion = data.descripcion ?? data.Descripcion;
  const proveedorNombre = data.proveedorNombre ?? data.ProveedorNombre;
  const categoriaNombre = data.categoriaNombre ?? data.CategoriaNombre;
  const precio = data.precioCRC ?? data.PrecioCRC;
  const vigIni = (data.vigenciaInicio ?? data.VigenciaInicio)?.slice?.(0, 10);
  const vigFin = (data.vigenciaFin ?? data.VigenciaFin)?.slice?.(0, 10);
  const condiciones = data.condiciones ?? data.Condiciones;
  const imagen = data.imagenUrl ?? data.ImagenUrl;

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h2 className="text-base font-semibold leading-tight">{titulo}</h2>
          <div className="mt-1 text-xs text-white/60">
            {proveedorNombre ? proveedorNombre : "—"} {categoriaNombre ? `• ${categoriaNombre}` : ""}
          </div>
        </div>
      </div>

      {/* Imagen principal (mobile-friendly) */}
      {imagen ? (
        <div className="overflow-hidden rounded-xl bg-white/5">
          <img
            src={typeof imagen === "string" ? imagen : `data:image/*;base64,${imagen}`}
            alt={titulo}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover"
          />
        </div>
      ) : null}

      {/* Info breve */}
      <div className="rounded-xl bg-white/5 p-3">
        <Line label="Precio">
          {typeof precio === "number"
            ? `₡ ${precio.toLocaleString("es-CR")}`
            : precio
            ? `₡ ${Number(precio).toLocaleString("es-CR")}`
            : "—"}
        </Line>
        <Line label="Vigencia">
          {vigIni || vigFin ? `${vigIni ?? "—"} – ${vigFin ?? "—"}` : "—"}
        </Line>
      </div>

      {/* Descripción */}
      {descripcion ? (
        <Section title="Descripción">
          <p className="whitespace-pre-wrap">{descripcion}</p>
        </Section>
      ) : null}

      {/* Condiciones */}
      {condiciones ? (
        <Section title="Condiciones" defaultOpen={false}>
          <p className="whitespace-pre-wrap">{condiciones}</p>
        </Section>
      ) : null}
    </div>
  );
}
