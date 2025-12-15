import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeneficioApi } from "../services/adminApi";

export default function ProviderPortal() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const session = useMemo(() => {
    try {
      const raw = localStorage.getItem("hr_proveedor_session");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let alive = true;
    const fetchBenefits = async () => {
      if (!session?.proveedorId) return;
      try {
        setLoading(true);
        setError("");
        const data = await BeneficioApi.list();
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter(
          (b) =>
            String(
              b?.proveedorId ?? b?.ProveedorId ?? b?.proveedor?.id ?? ""
            ).trim() === String(session.proveedorId).trim()
        );
        setItems(filtered);
      } catch (err) {
        console.error("No se pudieron cargar los beneficios", err);
        setError("No se pudieron cargar los beneficios");
      } finally {
        alive && setLoading(false);
      }
    };
    fetchBenefits();
    return () => {
      alive = false;
    };
  }, [session?.proveedorId]);

  const handleLogout = () => {
    localStorage.removeItem("hr_proveedor_session");
    navigate("/login", { replace: true });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/50">
            Portal de proveedor
          </p>
          <h1 className="text-2xl font-semibold">
            {session?.nombre || "Proveedor"}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full border border-white/15 hover:bg-white/5 text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      {loading && (
        <p className="text-sm text-white/60">Cargando beneficios...</p>
      )}
      {error && (
        <p className="text-sm text-red-300">
          {error || "No se pudieron cargar los beneficios"}
        </p>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((b) => (
            <article
              key={b.id ?? b.beneficioId ?? b.Id}
              className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-2"
            >
              <h2 className="text-lg font-semibold">{b.titulo || "(Sin título)"}</h2>
              <p className="text-sm text-white/70 whitespace-pre-line">
                {b.descripcion || "Sin descripción"}
              </p>
              <p className="text-xs text-white/50">
                Vigencia: {b.vigenciaInicio?.slice?.(0, 10) || "—"} →
                {" "}
                {b.vigenciaFin?.slice?.(0, 10) || "—"}
              </p>
              <p className="text-sm font-semibold text-emerald-300">
                {b.precioCRC != null ? `₡${b.precioCRC}` : "Consultar"}
              </p>
            </article>
          ))}

          {items.length === 0 && (
            <p className="text-sm text-white/60">
              Aún no tienes beneficios registrados.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
