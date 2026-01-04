import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginWithCredentials,
  validateSessionAndAuthorize,
} from "../core-config/useCases";

export default function LoginFormScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("credentials");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const allowToken = false;

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await validateSessionAndAuthorize({
        requiredRoles: ["Admin"],
      });

      if (!active) return;
      if (result?.status === "OK") {
        navigate("/", { replace: true });
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleCredentialsSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginWithCredentials({ usuario, password });
    if (result?.ok) {
      navigate("/", { replace: true });
    } else {
      setError(result?.message || "No se pudo iniciar sesión");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-sm w-full space-y-4 border border-white/10 rounded-2xl p-6 bg-black/50">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-white/50">Admin</p>
          <h1 className="text-2xl font-semibold">Inicio de sesión</h1>
        </div>

        <div className="flex rounded-full bg-neutral-900/70 border border-white/10 p-1">
          <button
            type="button"
            onClick={() => setMode("credentials")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
              mode === "credentials"
                ? "bg-emerald-500 text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            Usuario y contraseña
          </button>
          <button
            type="button"
            disabled={!allowToken}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
              mode === "token"
                ? "bg-emerald-500 text-black"
                : "text-white/70 hover:text-white"
            } ${!allowToken ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Token
          </button>
        </div>

        {mode === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
