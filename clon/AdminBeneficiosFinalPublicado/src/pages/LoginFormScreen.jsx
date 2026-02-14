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

  const allowToken = false; // Fase 1: solo arte, tab token deshabilitado

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
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">
            Portal Admin
          </p>
          <h1 className="text-3xl font-bold">Acceso de Administración</h1>
          <p className="text-sm text-neutral-400">
            Ingresa con tu usuario y contraseña para continuar.
          </p>
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
              <label className="text-sm text-neutral-300">Usuario</label>
              <input
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
                placeholder="Tu usuario"
                autoComplete="username"
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
                placeholder="Tu contraseña"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ingresando..." : "Entrar"}
              </button>

              {/* Solo arte: mismo botón “Escanear QR” pero deshabilitado en Admin */}
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg border border-white/10 text-sm text-neutral-400 cursor-not-allowed"
              >
                Escanear QR
              </button>
            </div>

            {error && <p className="text-sm text-red-300">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
