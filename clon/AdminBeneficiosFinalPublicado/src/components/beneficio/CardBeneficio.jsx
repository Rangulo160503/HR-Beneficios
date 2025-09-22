// src/components/beneficio/CardBeneficio.jsx
import React, { useEffect, useState } from "react";
import { BeneficioApi } from "../../services/adminApi"; // ⟵ desde /components/beneficio a /components/services

// Normaliza cualquier forma de imagen hacia algo válido para <img src="...">
function toDisplaySrc(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  // ya es URL absoluta, data URL o blob
  if (/^(data:|https?:|blob:)/i.test(s)) return s;
  // ¿parece base64 crudo?
  const looksB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
  if (looksB64) return `data:image/jpeg;base64,${s.replace(/\s/g, "")}`;
  // algún path relativo u otro esquema
  return s;
}

export default function CardBeneficio({ item, onEdit, onDelete }) {
  // intenta con lo que venga en la card (url, base64, etc.)
  const [src, setSrc] = useState(() =>
    toDisplaySrc(
      item?.imagenUrl ?? item?.ImagenUrl ??
      item?.imagenBase64 ?? item?.ImagenBase64 ??
      item?.imagen ?? item?.Imagen ?? ""
    )
  );

  // Si no hay imagen en la card, hidrata desde el detalle del beneficio
  useEffect(() => {
    let cancel = false;

    // si el item se actualiza y ahora trae algo inline, úsalo
    const inlineRaw =
      item?.imagenUrl ?? item?.ImagenUrl ??
      item?.imagenBase64 ?? item?.ImagenBase64 ??
      item?.imagen ?? item?.Imagen ?? "";
    if (!src && inlineRaw) {
      setSrc(toDisplaySrc(inlineRaw));
      return;
    }

    // si seguimos sin src y hay id, pide el detalle para intentar obtener imagen
    (async () => {
      if (src || !item?.id) return;
      try {
        const full = await BeneficioApi.get(item.id);
        if (cancel) return;
        const raw =
          full?.imagenUrl ?? full?.ImagenUrl ??
          full?.imagenBase64 ?? full?.ImagenBase64 ??
          full?.imagen ?? full?.Imagen ?? "";
        if (raw) setSrc(toDisplaySrc(raw));
      } catch {
        // silencioso: si falla, dejamos "Sin imagen"
      }
    })();

    return () => { cancel = true; };
  }, [item?.id, item?.imagen, item?.imagenUrl, src]);

  const precio = item?.precioCRC ?? item?.precio ?? null;

  return (
    <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
      <div className="relative">
        <div className="absolute left-3 top-3 z-10">
          <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
            {item?.categoriaNombre || "—"}
          </span>
        </div>
        <div className="aspect-video bg-neutral-800 grid place-items-center text-white/50">
          {src ? (
            <img className="w-full h-full object-cover" src={src} alt={item?.titulo || ""} />
          ) : (
            <div>Sin imagen</div>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="text-sm text-white/70">{item?.proveedorNombre || "—"}</div>
        <div className="text-lg font-semibold">{item?.titulo || "Beneficio"}</div>
        <div className="text-sm text-white/60">
          ₡ {precio != null ? Number(precio).toLocaleString("es-CR") : "—"}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-sm font-medium"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
