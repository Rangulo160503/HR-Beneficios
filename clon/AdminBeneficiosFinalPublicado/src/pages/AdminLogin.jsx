import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/authApi";
import { adminSessionStore } from "../core-config/sessionStores";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, expiresAt, profile } = await adminLogin({ user, pass });

      adminSessionStore.setSession({
        access_token: token, // mantenemos el nombre interno para no romper el resto del admin
        token_type: "Bearer",
        expires_at: new Date(expiresAt).getTime(),
        user: profile,
      });

      navigate("/admin", { replace: true });
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
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full space-y-4 border border-white/10 rounded-2xl p-6 bg-black/50"
      >
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-white/50">Admin</p>
          <h1 className="text-2xl font-semibold">Inicio de sesión</h1>
        </div>

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
    </div>
  );
}
