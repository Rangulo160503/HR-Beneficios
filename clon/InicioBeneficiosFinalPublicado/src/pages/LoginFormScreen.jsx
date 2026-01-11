import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const allowToken = true;

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result =
      mode === "token"
        ? await loginWithToken({ token })
        : await loginWithCredentials({ usuario, password });
    if (result?.ok) {
      if (!redirectToPortal(result?.session)) {
        navigate("/", { replace: true });
      }
    } else {
      setError(result?.message || "No se pudo iniciar sesión");
    }

    setLoading(false);
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
