import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import {
  loginWithCredentials,
  loginWithToken,
  validateSessionAndAuthorize,
} from "../core-config/useCases";

const TARGET = import.meta.env.VITE_PORTAL_TARGET || "local";

const PORTAL_BASES = {
  local: {
    colaboradores: import.meta.env.VITE_CLIENT_PORTAL_BASE_LOCAL || "http://localhost:5176",
    proveedores: import.meta.env.VITE_PROV_PORTAL_BASE_LOCAL || "http://localhost:5175",
    admin: import.meta.env.VITE_ADMIN_PORTAL_BASE_LOCAL || "http://localhost:5174",
  },
  cloud: {
    colaboradores: import.meta.env.VITE_CLIENT_PORTAL_BASE_CLOUD,
    proveedores: import.meta.env.VITE_PROV_PORTAL_BASE_CLOUD,
    admin: import.meta.env.VITE_ADMIN_PORTAL_BASE_CLOUD,
  },
};

// ⛔️ Ya NO usamos redirect automático aquí.
// Los PORTAL_BASES se usan en el Landing (botones).

export default function LoginFormScreen() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("password");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [error, setError] = useState("");
  const [qrError, setQrError] = useState("");
  const [loading, setLoading] = useState(false);

  const allowToken = true;
  const qrFileInputRef = useRef(null);
  const autoSubmitRef = useRef(false);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");
    setQrError("");
  };

  // ✅ Si YA hay sesión válida, no muestres login: vuelve al landing (/)
  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const result = await validateSessionAndAuthorize();

        if (!active) return;

        if (result?.status === "OK") {
          // ✅ NO redirigir a otros portales aquí
          navigate("/", { replace: true });
        }
      } catch (e) {
        console.error("checkSession error:", e);
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [navigate]);

  const executeLogin = async ({
    mode: modeOverride = mode,
    token: tokenOverride = token,
    usuario: usuarioOverride = usuario,
    password: passwordOverride = password,
  } = {}) => {
    setError("");
    setLoading(true);

    try {
      const result =
        modeOverride === "token"
          ? await loginWithToken({ token: tokenOverride })
          : await loginWithCredentials({
              usuario: usuarioOverride,
              password: passwordOverride,
            });

      if (result?.ok) {
        // ✅ Login OK -> quedarse en el Landing (/) en este mismo portal
        // ⛔️ NO window.location.assign a 5176/5175 aquí
        navigate("/", { replace: true });
      } else {
        setError(result?.message || "No se pudo iniciar sesión");
      }
    } catch (e) {
      console.error("executeLogin error:", e);
      setError("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await executeLogin();
  };

  const extractTokenFromQr = (qrText) => {
    if (!qrText) return { token: "", proveedorId: "" };

    try {
      const url = new URL(qrText);
      return {
        token: url.searchParams.get("token") || "",
        proveedorId: url.searchParams.get("proveedorId") || "",
      };
    } catch {
      return { token: qrText, proveedorId: "" };
    }
  };

  const handleQrUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setQrError("");
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          setQrError("No se pudo leer la imagen del QR.");
          return;
        }

        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrResult = jsQR(imageData.data, canvas.width, canvas.height);
        const qrText = qrResult?.data?.trim();

        if (!qrText) {
          setQrError("No se pudo leer el código QR.");
          canvas.width = 0;
          canvas.height = 0;
          return;
        }

        const { token: extractedToken, proveedorId: extractedProveedorId } =
          extractTokenFromQr(qrText);

        if (!extractedToken) {
          setQrError("El QR no contiene un token válido.");
          canvas.width = 0;
          canvas.height = 0;
          return;
        }

        setToken(extractedToken);
        setProveedorId(extractedProveedorId);
        setMode("token");
        setQrError("");

        if (!autoSubmitRef.current) {
          autoSubmitRef.current = true;
          executeLogin({ mode: "token", token: extractedToken });
        }

        canvas.width = 0;
        canvas.height = 0;
      };

      image.onerror = () => setQrError("No se pudo leer la imagen del QR.");
      image.src = reader.result;
    };

    reader.onerror = () => setQrError("No se pudo leer la imagen del QR.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleQrButtonClick = () => {
    qrFileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">
            HR Beneficios
          </p>
          <h1 className="text-3xl font-bold">Bienvenido</h1>
          <p className="text-sm text-neutral-400">
            Ingresá con tu usuario o token para continuar.
          </p>
        </div>

        <div className="flex rounded-full bg-neutral-900/70 border border-white/10 p-1">
          <button
            type="button"
            onClick={() => handleModeChange("password")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
              mode === "password"
                ? "bg-emerald-500 text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            Usuario y contraseña
          </button>

          <button
            type="button"
            disabled={!allowToken}
            onClick={() => handleModeChange("token")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
              mode === "token"
                ? "bg-emerald-500 text-black"
                : "text-white/70 hover:text-white"
            } ${!allowToken ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Token
          </button>
        </div>

        {mode === "password" && (
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-sm text-neutral-300">Usuario</label>
              <input
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
                autoComplete="username"
                placeholder="Tu usuario"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-neutral-300">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
                autoComplete="current-password"
                placeholder="Tu contraseña"
                required
              />
            </div>
          </div>
        )}

        {mode === "token" && (
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-sm text-neutral-300">Token</label>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
                autoComplete="one-time-code"
                placeholder="Pega tu token de acceso"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleQrButtonClick}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm text-neutral-200 hover:bg-white/5 transition"
              >
                Subir QR
              </button>

              <input
                ref={qrFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/*"
                className="hidden"
                onChange={handleQrUpload}
              />

              {proveedorId ? (
                <div className="flex-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                  Proveedor detectado: <span className="font-semibold">{proveedorId}</span>
                </div>
              ) : (
                <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                  Tip: el QR puede contener un link con <b>token</b> y <b>Id del proveedor</b>.
                </div>
              )}
            </div>

            {qrError && <p className="text-sm text-red-300">{qrError}</p>}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Ingresando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
