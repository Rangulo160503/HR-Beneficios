import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithToken } from "../../core-config/useCases";

export default function LoginFormScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("token");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const modes = useMemo(
    () => [
      { key: "credentials", label: "Usuario y contraseña", enabled: false },
      { key: "token", label: "Token", enabled: true },
    ],
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingToken = params.get("token");
    if (incomingToken) {
      setToken(incomingToken);
    }
  }, []);

  const normalizeProveedorSession = (data, { token: rawToken }) => {
    const proveedor = data?.proveedor ?? data?.Proveedor ?? data?.provider ?? null;
    const proveedorId =
      proveedor?.proveedorId || proveedor?.ProveedorId || proveedor?.id || proveedor?.Id;
    const proveedorNombre =
      proveedor?.nombre || proveedor?.Nombre || proveedor?.titulo || proveedor?.Titulo;

    return {
      proveedorId,
      proveedorNombre,
      token: rawToken,
      roles: ["Proveedor"],
      tsLogin: Date.now(),
      user: proveedor ?? null,
    };
  };

  const handleTokenSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginWithToken({
        token,
        normalizeSession: normalizeProveedorSession,
      });

      if (!result.ok || !result.session?.proveedorId) {
        throw result.error || new Error(result.message || "Token inválido.");
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "No pudimos validar tu acceso.");
    } finally {
      setLoading(false);
    }
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
            Ingresa con tu token de acceso o escanea tu QR.
          </p>
        </div>

        <div className="flex rounded-full border border-white/10 bg-neutral-950/60 p-1 text-xs">
          {modes.map((option) => {
            const active = mode === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => option.enabled && setMode(option.key)}
                className={`flex-1 rounded-full px-3 py-2 font-semibold transition ${
                  active ? "bg-emerald-500 text-black" : "text-white/70"
                } ${option.enabled ? "" : "opacity-40 cursor-not-allowed"}`}
                disabled={!option.enabled}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {mode === "token" && (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-white/70">Token</label>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                placeholder="Pega tu token"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full px-4 py-2 rounded-full border border-white/15 text-sm text-white/70"
                disabled
              >
                Scan QR
              </button>
              <button
                type="submit"
                disabled={loading || !token}
                className="w-full px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Validando..." : "Entrar"}
              </button>
            </div>
            {error && <p className="text-sm text-red-300 text-center">{error}</p>}
          </form>
        )}

        {mode === "credentials" && (
          <div className="text-center text-sm text-neutral-500">
            El acceso con usuario y contraseña está disponible solo para administradores.
          </div>
        )}
      </div>
    </div>
  );
}
