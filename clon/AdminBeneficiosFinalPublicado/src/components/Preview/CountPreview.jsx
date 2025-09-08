// CountPreview.jsx
import { useEffect, useState } from "react";
import { Categorias } from "../../services/api.js";

export default function CountPreview() {
  const [n, setN] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Categorias.contar()
      .then(r => setN(typeof r?.total === "number" ? r.total : r))
      .catch(() => setError("No se pudo obtener el conteo"));
  }, []);

  if (error) return <div className="text-red-300 text-sm">{error}</div>;
  if (n === null) return <div className="text-white/70">Cargando…</div>;
  return <div className="text-white">Total categorías: <b>{n}</b></div>;
}
