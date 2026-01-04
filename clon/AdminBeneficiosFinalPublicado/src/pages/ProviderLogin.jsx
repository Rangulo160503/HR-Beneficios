import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProveedorApi } from "../services/adminApi";
import { setSession } from "../utils/hrSession";

export default function ProviderLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const token = useMemo(() => params.get("token")?.trim() || "", [params]);

  useEffect(() => {
    const existing = (() => {
      try {
        const raw = localStorage.getItem("hr_session");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();
    if (existing?.role === "Proveedor" && existing?.token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let alive = true;
    const login = async () => {
      if (!token) {
        setError("El enlace de acceso es inválido o expiró.");
        setStatus("error");
        return;
      }
      try {
        setStatus("loading");
        setError("");
        const proveedores = await ProveedorApi.list();
        if (!alive) return;
        const proveedor = Array.isArray(proveedores)
          ? proveedores.find((p) => (p?.accessToken || "").trim() === token)
          : null;
        if (!proveedor) throw new Error("Proveedor no encontrado");
        const nombre =
          proveedor?.nombre || proveedor?.Nombre || proveedor?.titulo || proveedor?.Titulo || "";
        const proveedorId =
          proveedor?.proveedorId || proveedor?.id || proveedor?.ProveedorId || proveedor?.ID;
        // Sesión compartida entre apps (clave hr_session).
        setSession({
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          role: "Proveedor",
          subjectId: proveedorId || null,
          proveedorNombre: nombre || null,
        });
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Login de proveedor falló", err);
        setError("El enlace de acceso es inválido o expiró.");
        setStatus("error");
      }
    };
    login();
    return () => {
      alive = false;
    };
  }, [navigate, token]);

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
        {status === "idle" && !token && (
          <p className="text-sm text-white/70">El enlace de acceso es inválido o expiró.</p>
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
