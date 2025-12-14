import { useState } from "react";
import "./LandingIntro.css";
import InfoBoardModal from "../InfoBoardModal";
import { LANDING_TEXT } from "./constants";
import { useLandingIntro } from "./useLandingIntro";

export default function LandingIntro({ onOpenPreview }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  useLandingIntro();

  const headlineLines = LANDING_TEXT.headline.split("\n");
  const accessOptions = [
    {
      label: "Colaboradores",
      href:
        "https://hr-beneficios-web-client-cfdshdfeeyemfmh3.canadacentral-01.azurewebsites.net/",
    },
    {
      label: "Proveedores",
      href:
        "https://hr-beneficios-web-proveedor-btgqhgdfaqhzc0gg.canadacentral-01.azurewebsites.net/",
    },
    {
      label: "Administración",
      href:
        "https://hr-beneficios-web-admin-dqbwbedkb2duhqbs.canadacentral-01.azurewebsites.net/",
    },
  ];

  return (
    <div className="landing-root">
      {/* Topbar tipo Cash */}
      <div className="landing-topbar">

        <div className="landing-actions">
          <button
            className="pill black"
            onClick={() => setInfoModalOpen(true)}
          >
            Pizarra informativa
          </button>
        </div>
      </div>

      <section className="landing-hero">
        {/* Left */}
        <div className="col left">
          <h1>
            {headlineLines.map((l, i) => (
              <span key={i}>
                {l}
                <br />
              </span>
            ))}
          </h1>

          <p>{LANDING_TEXT.sub}</p>

          <button className="cta black" onClick={onOpenPreview}>
            {LANDING_TEXT.leftBtn}
          </button>
        </div>
        {/* Access panel */}
        <div className="col panel">
          <div className="access-panel">
            <div className="access-header">
              <p className="access-kicker">{LANDING_TEXT.kicker}</p>
              <h2>{LANDING_TEXT.panelTitle}</h2>
              <p className="access-subtitle">{LANDING_TEXT.panelSubtitle}</p>
            </div>

            <div className="access-grid">
              {accessOptions.map((option) => (
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
        </div>
      </section>

      <InfoBoardModal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      />
    </div>
  );
}