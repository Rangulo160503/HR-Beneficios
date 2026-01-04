import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithCredentials } from "../core-config/useCases";

export default function LoginFormScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("credentials");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
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

  const normalizeAdminSession = (data) => {
    const profile = data?.profile || data?.user || null;
    const roles = profile?.roles || profile?.Roles || ["Admin"];
    const expiresAt = data?.expiresAt ?? data?.expires_at;
    return {
      access_token: data?.token ?? data?.access_token,
      token_type: data?.tokenType ?? data?.token_type ?? "Bearer",
      expires_at: expiresAt ? new Date(expiresAt).getTime() : null,
      user: profile,
      roles,
    };
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginWithCredentials({
        usuario: user,
        password: pass,
        normalizeSession: normalizeAdminSession,
      });

      if (!result.ok) {
        throw result.error || new Error(result.message);
      }

      navigate("/", { replace: true });
    } catch (err) {
      if (err?.message === "Credenciales inválidas")
        setError(err.message);
      else setError("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-sm w-full space-y-4 border border-white/10 rounded-2xl p-6 bg-black/50">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-white/50">Admin</p>
          <h1 className="text-2xl font-semibold">Inicio de sesión</h1>
        </div>

        <div className="flex rounded-full border border-white/10 bg-neutral-900/60 p-1 text-xs">
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

        {mode === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-white/70">Usuario</label>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-white/70">Contraseña</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
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

        {mode === "token" && (
          <form className="space-y-4">
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
                className="flex-1 px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold opacity-50 cursor-not-allowed"
              >
                Entrar
              </button>
            </div>
            {token && (
              <p className="text-xs text-white/50">
                El acceso por token está disponible solo en el portal de proveedores.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
