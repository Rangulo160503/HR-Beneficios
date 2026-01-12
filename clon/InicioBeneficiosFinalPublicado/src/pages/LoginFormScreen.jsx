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
    colaboradores: import.meta.env.VITE_CLIENT_PORTAL_BASE_LOCAL || "http://localhost:5173",
    proveedores: import.meta.env.VITE_PROV_PORTAL_BASE_LOCAL || "http://localhost:5173",
    admin: import.meta.env.VITE_ADMIN_PORTAL_BASE_LOCAL || "http://localhost:5174",
  },
  cloud: {
    colaboradores: import.meta.env.VITE_CLIENT_PORTAL_BASE_CLOUD,
    proveedores: import.meta.env.VITE_PROV_PORTAL_BASE_CLOUD,
    admin: import.meta.env.VITE_ADMIN_PORTAL_BASE_CLOUD,
  },
};

const normalizeRole = (role) => String(role || "").trim().toLowerCase();

const getSessionRoles = (session) =>
  session?.roles ||
  session?.user?.roles ||
  session?.user?.Roles ||
  session?.user?.perfil?.roles ||
  [];

const resolvePortalKey = (session) => {
  const roles = getSessionRoles(session).map(normalizeRole);

  if (roles.some((role) => ["admin", "administrator", "administrador"].includes(role))) {
    return "admin";
  }

  if (
    roles.some((role) => ["proveedor", "provider"].includes(role)) ||
    session?.proveedorId
  ) {
    return "proveedores";
  }

  if (
    roles.some((role) => ["client", "cliente", "usuario", "colaborador"].includes(role))
  ) {
    return "colaboradores";
  }

  return session?.proveedorId ? "proveedores" : "colaboradores";
};

const buildPortalUrl = (session) => {
  const portalKey = resolvePortalKey(session);
  const base = PORTAL_BASES[TARGET] ?? PORTAL_BASES.local;
  const baseUrl = String(base?.[portalKey] || "").replace(/\/+$/, "");

  if (!baseUrl) return null;

  if (portalKey === "admin") {
    return `${baseUrl}/admin`;
  }

  return `${baseUrl}/`;
};

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

  const redirectToPortal = (session) => {
    const targetUrl = buildPortalUrl(session);
    if (targetUrl) {
      window.location.assign(targetUrl);
      return true;
    }
    return false;
  };

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await validateSessionAndAuthorize();

      if (!active) return;
      if (result?.status === "OK") {
        if (!redirectToPortal(result?.session)) {
          navigate("/", { replace: true });
        }
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

    const result =
      modeOverride === "token"
        ? await loginWithToken({ token: tokenOverride })
        : await loginWithCredentials({
            usuario: usuarioOverride,
            password: passwordOverride,
          });
    if (result?.ok) {
      if (!redirectToPortal(result?.session)) {
        navigate("/", { replace: true });
      }
    } else {
      setError(result?.message || "No se pudo iniciar sesión");
    }

    setLoading(false);
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
    } catch (error) {
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
        image.src = "";
      };

      image.onerror = () => {
        setQrError("No se pudo leer la imagen del QR.");
      };

      image.src = reader.result;
    };

    reader.onerror = () => {
      setQrError("No se pudo leer la imagen del QR.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleQrButtonClick = () => {
    qrFileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-4 text-center border border-white/10 rounded-2xl p-6 bg-black/50"
      >
        <h1 className="text-2xl font-semibold">Bienvenido</h1>
        <p className="text-sm text-white/70">
          Ingresa tu usuario y contraseña para continuar con HR Beneficios.
        </p>

        <div className="flex rounded-full bg-neutral-900/70 border border-white/10 p-1">
          <button
            type="button"
            onClick={() => handleModeChange("password")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
              mode === "password"
                ? "bg-white text-black"
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
                ? "bg-white text-black"
                : "text-white/70 hover:text-white"
            } ${!allowToken ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Token
          </button>
        </div>

        {mode === "password" && (
          <div className="space-y-3 text-left">
            <div className="space-y-1">
              <label className="text-sm text-white/70">Usuario</label>
              <input
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-white/70">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                autoComplete="current-password"
              />
            </div>
          </div>
        )}

        {mode === "token" && (
          <div className="space-y-3 text-left">
            <div className="space-y-1">
              <label className="text-sm text-white/70">Token</label>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                autoComplete="one-time-code"
                placeholder="Ingresa tu token"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQrButtonClick}
                className="px-3 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-white/70 hover:text-white transition"
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
            </div>
            {qrError && <p className="text-sm text-red-300">{qrError}</p>}
          </div>
        )}

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Ingresando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
