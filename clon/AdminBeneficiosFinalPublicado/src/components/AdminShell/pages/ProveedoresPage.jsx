// src/components/AdminShell/pages/ProveedoresPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ProveedorApi } from "../../../services/adminApi";

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const norm = (v) => (v == null ? "" : String(v).trim());
const getProvId = (p) => norm(p?.proveedorId ?? p?.id ?? p?.ProveedorId ?? p?.ID);
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
      const link = proveedorId ? `${origin}/login?proveedorId=${proveedorId}` : "";
      return { ...p, proveedorId, link };
    });
  }, [provs]);

  useEffect(() => {
    for (const p of provs) {
      const pid = getProvId(p);
      if (GUID_RE.test(pid) || attempted.current.has(pid || p?.nombre)) continue;
      attempted.current.add(pid || p?.nombre || Math.random().toString());
      assignGuid(p).catch((err) => {
        console.error("No se pudo asignar GUID", err);
        setError("No se pudo generar un ID para algunos proveedores.");
      });
    }
  }, [provs]);

  const assignGuid = async (prov) => {
    const apiId = getProvId(prov) || prov?.id;
    if (!apiId) return;
    const nuevoGuid = guid();
    setProcessing((s) => ({ ...s, [apiId]: true }));
    try {
      await ProveedorApi.update(apiId, {
        nombre: prov?.nombre ?? prov?.Nombre ?? "",
        proveedorId: nuevoGuid,
      });
      const fresh = await ProveedorApi.get(apiId);
      const normalized = {
        ...fresh,
        id: getProvId(fresh) || apiId,
        proveedorId: getProvId(fresh) || nuevoGuid,
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
              <div>
                <p className="text-sm font-semibold">{p.nombre ?? p.Nombre}</p>
                <p className="text-[11px] text-white/50 break-all">
                  {p.proveedorId || "Asignando GUID..."}
                </p>
              </div>
              <button
                className="px-2 py-1 rounded-full text-[11px] bg-white/5 hover:bg-white/10"
                onClick={() => handleCopy(p.link)}
                disabled={!p.link}
              >
                Copiar link
              </button>
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
                  {processing[getProvId(p)] ? "Generando QR..." : "Sin identificador"}
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
