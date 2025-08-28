import { useEffect, useState } from "react";
import { api, EP } from "../../services/beneficiosService.js"; // <- usa EP.publicados
import BenefitCard from "../BenefitCard";

export default function PublicadosPreview() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const ac = new AbortController();
  let mounted = true;

  (async () => {
    try {
      const data = await api.get(EP.publicados, { signal: ac.signal }); // <- usa tu helper
      if (!mounted) return;
      const map = (x) => ({
        id: x.beneficioId ?? x.BeneficioId,
        titulo: x.titulo ?? x.Titulo,
        proveedor: x.proveedorNombre ?? x.ProveedorNombre,
        imagen: x.imagenUrl ?? x.ImagenUrl,
      });
      setRows(Array.isArray(data) ? data.map(map) : []);
    } catch (e) {
      // En StrictMode, el primer render aborta: lo ignoramos
      if (e?.name === "AbortError") return;
      setError("No se pudieron cargar los publicados.");
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => {
    mounted = false;
    ac.abort();
  };
}, []);


  if (error) return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>;
  if (loading) return <div className="py-4 text-white/70">Cargando…</div>;
  if (!rows.length) return <div className="py-4 text-white/60">No hay beneficios publicados.</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {rows.map((it) => (
        <BenefitCard key={it.id} item={it} onClick={() => {}} />
      ))}
    </div>
  );
}
