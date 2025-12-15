// src/components/AdminShell/pages/ProveedoresPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ProveedorApi } from "../../../services/adminApi";
import { buildBadgeLink, generateAccessToken } from "../../../utils/badge";

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const norm = (v) => (v == null ? "" : String(v).trim());
const getProvId = (p) => norm(p?.proveedorId ?? p?.id ?? p?.ProveedorId ?? p?.ID);
const getToken = (p) => norm(p?.accessToken);
const guid = () =>
  crypto.randomUUID?.() ||
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export default function ProveedoresPage({ provs = [], addProveedor, onProveedorUpdated }) {
  const [processing, setProcessing] = useState({});
  const [error, setError] = useState("");
  const attempted = useRef(new Set());

  const withLinks = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return provs.map((p) => {
      const proveedorId = getProvId(p);
      const accessToken = getToken(p);
      const link = buildBadgeLink(origin, accessToken);
      return { ...p, proveedorId, accessToken, link };
    });
  }, [provs]);

  useEffect(() => {
    for (const p of provs) {
      const pid = getProvId(p);
      const token = getToken(p);
      if ((GUID_RE.test(pid) && token) || attempted.current.has(pid || p?.nombre))
        continue;
      attempted.current.add(pid || p?.nombre || Math.random().toString());
      ensureBadge(p).catch((err) => {
        console.error("No se pudo preparar badge", err);
        setError("No se pudo generar un badge para algunos proveedores.");
      });
    }
  }, [provs]);

  const ensureBadge = async (prov, { regenerateToken = false } = {}) => {
    const apiId = getProvId(prov) || prov?.id;
    if (!apiId) return;
    const existingId = getProvId(prov);
    const nuevoGuid = GUID_RE.test(existingId) ? existingId : guid();
    const nuevoToken = regenerateToken || !getToken(prov)
      ? generateAccessToken()
      : getToken(prov);
    setProcessing((s) => ({ ...s, [apiId]: true }));
    try {
      await ProveedorApi.update(apiId, {
        nombre: prov?.nombre ?? prov?.Nombre ?? "",
        proveedorId: nuevoGuid,
        accessToken: nuevoToken,
      });
      const fresh = await ProveedorApi.get(apiId);
      const normalized = {
        ...fresh,
        id: getProvId(fresh) || apiId,
        proveedorId: getProvId(fresh) || nuevoGuid,
        accessToken: getToken(fresh) || nuevoToken,
        nombre: fresh?.nombre ?? prov?.nombre ?? prov?.Nombre,
      };
      onProveedorUpdated?.(normalized);
    } finally {
      setProcessing((s) => {
        const copy = { ...s };
        delete copy[apiId];
        return copy;
      });
    }
  };

  const handleCopy = async (link) => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copiado");
    } catch (err) {
      console.error("No se pudo copiar", err);
    }
  };

  const handleRegenerate = async (prov) => {
    if (!prov) return;
    await ensureBadge(prov, { regenerateToken: true });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={async () => {
            setError("");
            await addProveedor?.();
          }}
          className="px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10"
        >
          + Nuevo
        </button>
        {error && <p className="text-xs text-amber-300">{error}</p>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {withLinks.map((p) => (
          <div
            key={p.proveedorId || p.id}
            className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold">{p.nombre ?? p.Nombre}</p>
                <p className="text-[11px] text-white/60 break-all">
                  ID: {p.proveedorId || "Asignando ID..."}
                </p>
                <p className="text-[11px] text-white/60 break-all">
                  Badge: {p.accessToken || "Generando badge..."}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <button
                  className="px-2 py-1 rounded-full text-[11px] bg-white/5 hover:bg-white/10 disabled:opacity-50"
                  onClick={() => handleCopy(p.link)}
                  disabled={!p.link}
                >
                  Copiar link
                </button>
                <button
                  className="px-2 py-1 rounded-full text-[11px] bg-white/5 hover:bg-white/10 disabled:opacity-50"
                  onClick={() => handleRegenerate(p)}
                  disabled={processing[getProvId(p)]}
                >
                  Regenerar badge
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-2 grid place-items-center">
              {p.link ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(p.link)}`}
                  alt={`QR ${p.nombre}`}
                  className="w-full max-w-[180px] h-auto"
                />
              ) : (
                <p className="text-xs text-white/60">
                  {processing[getProvId(p)] ? "Generando badge..." : "Sin identificador"}
                </p>
              )}
            </div>
          </div>
        ))}

        {provs.length === 0 && (
          <p className="px-4 py-6 text-xs text-white/40 col-span-full">
            Aún no hay proveedores registrados.
          </p>
        )}
      </div>
    </section>
  );
}
