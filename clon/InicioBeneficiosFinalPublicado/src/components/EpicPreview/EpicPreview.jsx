import "./EpicPreview.css";
import { PREVIEW_ITEMS } from "./constants";
import { useEpicPreview } from "./useEpicPreview";

export default function EpicPreview({ open, onClose }) {
  useEpicPreview(open);

  if (!open) return null;

  return (
    <div className="preview-root" role="dialog" aria-modal="true">
      <div className="preview-backdrop" onClick={onClose} />

      <div className="preview-panel">
        <div className="preview-topbar">
          <div className="preview-title">Preview del sistema</div>
          <button className="preview-close" onClick={onClose}>✕</button>
        </div>

        <div className="preview-track">
          {PREVIEW_ITEMS.map((it) => (
            <section key={it.id} className="slide snap">
              <div className="slide-bg" style={{ backgroundImage: `url(${it.img})` }} />
              <div className="slide-overlay" />

              <div className="slide-content">
                <h2>{it.title}</h2>
                <p>{it.subtitle}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
