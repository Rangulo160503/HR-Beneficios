import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateProveedorLogin } from "../../core-config/useCases";
import { providerSessionStore } from "../../core-config/sessionStores";

const guidRegex = /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;

export default function ProveedorLogin() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState("checking");
  const [mensaje, setMensaje] = useState("Validando tu código QR…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const proveedorId = params.get("proveedorId");
    const token = params.get("token");

    if (!proveedorId || !guidRegex.test(proveedorId)) {
      setEstado("error");
      setMensaje(
        "El enlace de acceso es inválido. Pide un nuevo código QR al administrador."
      );
      return;
    }

    const validarProveedor = async () => {
      try {
        setMensaje("Validando tu código QR…");
        const resp = await validateProveedorLogin(proveedorId);

        if (resp?.ok) {
          providerSessionStore.setSession({
            proveedorId,
            token,
            roles: ["Proveedor"],
          });
          setEstado("ok");
          setMensaje(resp?.mensaje || "Proveedor válido. Redirigiendo…");

          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1000);
        } else {
          setEstado("error");
          setMensaje(resp?.mensaje || "QR inválido o proveedor no encontrado.");
        }
      } catch (error) {
        console.error("[ProveedorLogin] Error validando proveedor", error);
        setEstado("error");
        setMensaje(
          "No pudimos validar tu acceso. Intenta nuevamente o solicita un nuevo QR."
        );
      }
    };

    validarProveedor();
  }, [navigate]);

  const statusStyles = {
    checking: "text-neutral-300",
    ok: "text-emerald-400",
    error: "text-red-400",
  };

  const secondaryText =
    estado === "error"
      ? "Verifica que el QR sea el más reciente o solicita uno nuevo al administrador."
      : "";

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">Portal Proveedores</p>
          <h1 className="text-3xl font-bold">Acceso de Proveedores</h1>
          <p className="text-sm text-neutral-400">
            {estado === "checking"
              ? "Estamos validando tu código QR…"
              : estado === "ok"
              ? "Proveedor válido. Redirigiendo…"
              : "El enlace no es válido o expiró."}
          </p>
        </div>

        <div className="flex items-center justify-center">
          {estado === "checking" && (
            <div className="h-12 w-12 rounded-full border-2 border-emerald-400/70 border-t-transparent animate-spin" />
          )}
          {estado === "ok" && (
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/50 text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {estado === "error" && (
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/50 text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <path d="M12 9v4m0 4h.01" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
          )}
        </div>

        <div className={`text-center text-base font-medium ${statusStyles[estado]}`}>
          {mensaje}
        </div>

        {secondaryText && (
          <p className="text-center text-sm text-neutral-500 leading-relaxed">{secondaryText}</p>
        )}
      </div>
    </div>
  );
}
