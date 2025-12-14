import "./InfoBoardModal.css";

export default function InfoBoardModal({ open, onClose }) {
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
        </div>
      </div>
    </div>
  );
}