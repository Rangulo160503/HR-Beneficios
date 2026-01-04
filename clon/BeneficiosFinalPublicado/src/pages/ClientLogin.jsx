import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithCredentials } from "../core-config/useCases";

export default function LoginFormScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("credentials");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const modes = useMemo(
    () => [
      { key: "credentials", label: "Usuario y contraseña", enabled: true },
      { key: "token", label: "Token", enabled: false },
    ],
    []
  );

  const normalizeClientSession = (data) => ({
    token: data?.token ?? data?.access_token ?? "client-session",
    tsLogin: Date.now(),
    roles: data?.roles || data?.profile?.roles || ["Client"],
    user: data?.profile ?? data?.user ?? null,
  });

  const handleCredentialsSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginWithCredentials({
        usuario,
        password,
        normalizeSession: normalizeClientSession,
      });

      if (!result.ok) {
        throw result.error || new Error(result.message);
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Acceso de colaboradores</h1>
        <p className="text-sm text-white/70">
          Ingresa para explorar los beneficios disponibles.
        </p>
        <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-xs">
          {modes.map((option) => {
            const active = mode === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => option.enabled && setMode(option.key)}
                className={`flex-1 rounded-full px-3 py-2 font-semibold transition ${
                  active ? "bg-white text-black" : "text-white/70"
                } ${option.enabled ? "" : "opacity-40 cursor-not-allowed"}`}
                disabled={!option.enabled}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {mode === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-sm text-white/70">Usuario</label>
              <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-white/70">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-red-300 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>
        )}

        {mode === "token" && (
          <form className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-sm text-white/70">Token</label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                placeholder="Pega tu token"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 px-4 py-2 rounded-full border border-white/15 text-sm text-white/70"
                disabled
              >
                Scan QR
              </button>
              <button
                type="submit"
                disabled
                className="flex-1 px-4 py-2 rounded-full bg-white text-black font-semibold opacity-50 cursor-not-allowed"
              >
                Entrar
              </button>
            </div>
            {token && (
              <p className="text-xs text-white/50 text-center">
                El acceso por token está disponible solo en el portal de proveedores.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
