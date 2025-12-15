import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const expected = useMemo(() => {
    const envUser = import.meta.env.VITE_ADMIN_USER || "admin";
    const envPass = import.meta.env.VITE_ADMIN_PASS || "admin123";
    return { envUser, envPass };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (user === expected.envUser && pass === expected.envPass) {
      localStorage.setItem("hr_admin_session", JSON.stringify({ ts: Date.now() }));
      navigate("/admin", { replace: true });
      return;
    }
    setError("Credenciales inválidas");
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
          className="w-full px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
