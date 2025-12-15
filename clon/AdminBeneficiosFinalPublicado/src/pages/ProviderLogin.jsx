import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProveedorApi } from "../services/adminApi";

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function ProviderLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const proveedorId = useMemo(() => params.get("proveedorId")?.trim() || "", [params]);

  useEffect(() => {
    const existing = (() => {
      try {
        const raw = localStorage.getItem("hr_proveedor_session");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();
    if (existing?.proveedorId) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let alive = true;
    const login = async () => {
      if (!proveedorId || !GUID_RE.test(proveedorId)) {
        setError("El enlace no es válido o expiró.");
        setStatus("error");
        return;
      }
      try {
        setStatus("loading");
        setError("");
        const proveedor = await ProveedorApi.get(proveedorId);
        if (!alive) return;
        if (!proveedor) throw new Error("Proveedor no encontrado");
        const nombre =
          proveedor?.nombre || proveedor?.Nombre || proveedor?.titulo || proveedor?.Titulo || "";
        const session = {
          proveedorId,
          nombre,
          ts: Date.now(),
        };
        localStorage.setItem("hr_proveedor_session", JSON.stringify(session));
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Login de proveedor falló", err);
        setError("El enlace no es válido o expiró.");
        setStatus("error");
      }
    };
    login();
    return () => {
      alive = false;
    };
  }, [navigate, proveedorId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Ingreso de proveedor</h1>
        {status === "loading" && <p className="text-sm text-white/70">Validando enlace...</p>}
        {status === "error" && (
          <p className="text-sm text-red-300">
            {error || "El enlace no es válido o expiró."}
          </p>
        )}
        {status === "idle" && !proveedorId && (
          <p className="text-sm text-white/70">Falta el parámetro proveedorId.</p>
        )}
        <button
          onClick={() => navigate(0)}
          className="px-4 py-2 rounded-full border border-white/15 hover:bg-white/5 text-sm"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
