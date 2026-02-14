import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  loginWithToken,
  validateSessionAndAuthorize,
} from "../../core-config/useCases";

export default function LoginFormScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialToken = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [mode, setMode] = useState("token");
  const [token, setToken] = useState(initialToken);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const allowCredentials = false;

  useEffect(() => {
    setToken(initialToken);
  }, [initialToken]);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await validateSessionAndAuthorize({
        requiredRoles: ["Proveedor"],
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginWithToken({ token });
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
            Portal Proveedores
          </p>
          <h1 className="text-3xl font-bold">Acceso de Proveedores</h1>
          <p className="text-sm text-neutral-400">
            Ingresa tu token para continuar con tu portal.
          </p>
        </div>

        <div className="flex rounded-full bg-neutral-900/70 border border-white/10 p-1">
          <button
            type="button"
            disabled={!allowCredentials}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
              mode === "credentials"
                ? "bg-emerald-500 text-black"
                : "text-white/70 hover:text-white"
            } ${!allowCredentials ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Usuario y contraseña
          </button>
          <button
            type="button"
            onClick={() => setMode("token")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
              mode === "token"
                ? "bg-emerald-500 text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            Token
          </button>
        </div>

        {mode === "token" && (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-neutral-300">Token</label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
              placeholder="Pega tu token de acceso"
              autoComplete="one-time-code"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Validando..." : "Entrar"}
            </button>
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
