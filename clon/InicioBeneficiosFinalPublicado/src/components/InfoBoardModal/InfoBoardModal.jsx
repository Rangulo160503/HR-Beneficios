import "./InfoBoardModal.css";
import { INFO_BOARD_ITEMS } from "./constants";

export default function InfoBoardModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="info-modal-root" role="dialog" aria-modal="true">
      <div className="info-modal-backdrop" onClick={onClose} />

      <div className="info-modal-panel">
        <div className="info-modal-topbar">
          <div className="info-modal-heading">
            <div className="info-modal-title">Pizarra informativa</div>
            <span className="info-modal-badge">Próximamente</span>
          </div>
          <button className="info-modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="info-modal-body">
          <p className="info-modal-description">
            Se habilitará una pizarra para publicar links de charlas o campañas de las
            empresas en convenio.
          </p>

          <div className="info-modal-grid">
            {INFO_BOARD_ITEMS.map((item) => (
              <article key={item.id} className="info-card">
                <div className="info-card-title">{item.title}</div>
                <p className="info-card-text">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="info-modal-footer">
            <span className="info-modal-footnote">Coming soon</span>
            <button className="info-modal-action" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}