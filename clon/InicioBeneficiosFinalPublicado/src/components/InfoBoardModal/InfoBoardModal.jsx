import { useEffect, useMemo, useState } from "react";
import { getInfoBoard, mapInfoBoardItem } from "../../services/infoBoardService";
import "./InfoBoardModal.css";

export default function InfoBoardModal({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getInfoBoard({ activo: true, q: debouncedQ });
        if (!alive) return;
        setItems(Array.isArray(data) ? data.map(mapInfoBoardItem) : []);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "No se pudo cargar la pizarra.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [open, debouncedQ]);

  const empty = useMemo(() => !loading && !error && items.length === 0, [loading, error, items]);

  if (!open) return null;

  return (
    <div className="info-modal-root" role="dialog" aria-modal="true">
      <div className="info-modal-backdrop" onClick={onClose} />
      <div className="info-modal-panel">
        <div className="info-modal-topbar">
          <div className="info-modal-title">Pizarra informativa</div>
          <button className="info-modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="info-modal-body">
          <p className="info-modal-description">
            <em>
              Pizarra informativa para colgar links de charlas o campañas de las empresas con
              convenio.
            </em>
          </p>

          <div className="info-modal-search">
            <input
              type="search"
              placeholder="Buscar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {loading && <p className="info-modal-hint">Cargando anuncios…</p>}
          {error && (
            <p className="info-modal-error" role="alert">
              {error}
            </p>
          )}
          {empty && <p className="info-modal-hint">No hay anuncios activos.</p>}

          <div className="info-modal-list">
            {items.map((item) => (
              <article key={item.id || item.titulo} className="info-modal-card">
                <div className="info-modal-card-header">
                  <div>
                    <h3 className="info-modal-card-title">{item.titulo || "(Sin título)"}</h3>
                    {item.tipo && <p className="info-modal-chip">{item.tipo}</p>}
                  </div>
                  <button
                    className="info-modal-open"
                    onClick={() => item.url && window.open(item.url, "_blank", "noopener,noreferrer")}
                  >
                    Abrir
                  </button>
                </div>
                {item.descripcion && (
                  <p className="info-modal-card-desc">{item.descripcion}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}