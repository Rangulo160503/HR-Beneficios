import { useNavigate } from "react-router-dom";
import { clearSession } from "../utils/hrSession";
import { clearAuth } from "../utils/adminAuth";

export default function NotAuthorized({ loginPath = "/admin/login" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    clearAuth();
    navigate(loginPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-black/40 p-6 space-y-4 text-center">
        <h1 className="text-2xl font-semibold">No autorizado</h1>
        <p className="text-sm text-white/70">
          Tu sesión no tiene permisos para acceder a esta sección.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
          >
            Cerrar sesión
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-full border border-white/15 hover:bg-white/5"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
