import "./LandingIntro.css";

export default function LandingIntroCard({ kicker, title, subtitle, options }) {
  return (
    <div className="access-panel">
      <div className="access-header">
        <p className="access-kicker">{kicker}</p>
        <h2>{title}</h2>
        <p className="access-subtitle">{subtitle}</p>
      </div>

      <div className="access-grid">
        {(options || []).map((option) => (
          <button
            key={option.label}
            className="access-card"
            onClick={() => {
              window.location.href = option.href;
            }}
          >
            <span className="access-label">{option.label}</span>
            <span className="access-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}