import { useState } from "react";
import "./LandingIntro.css";
import InfoBoardModal from "../InfoBoardModal";
import { LANDING_TEXT } from "./constants";
import { useLandingIntro } from "./useLandingIntro";
import LandingIntroCard from "./LandingIntroCard";

export default function LandingIntro({
  onOpenPreview,
  accessOptions: accessOptionsProp,
  cardRef,
  visible = true,
  placeholder = false,
}) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  useLandingIntro();

  const headlineLines = LANDING_TEXT.headline.split("\n");
 
  const accessOptions =
    accessOptionsProp ?? [
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
    <div className={`landing-root ${visible ? "" : "landing-hidden"}`}>
      {/* Topbar tipo Cash */}
      <div className="landing-topbar">
        <div className="landing-logo">{LANDING_TEXT.logo}</div>

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
        
        <div className={`col panel ${placeholder ? "panel-placeholder" : ""}`}>
          <div ref={cardRef} className="panel-anchor">
            <LandingIntroCard
              kicker={LANDING_TEXT.kicker}
              title={LANDING_TEXT.panelTitle}
              subtitle={LANDING_TEXT.panelSubtitle}
              options={accessOptions}
            />
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
