import "./LandingIntro.css";
import { LANDING_TEXT } from "./constants";
import { useLandingIntro } from "./useLandingIntro";

export default function LandingIntro({ onOpenPreview }) {
  useLandingIntro();

  const headlineLines = LANDING_TEXT.headline.split("\n");
  const rightLines = LANDING_TEXT.rightText.split("\n");

  return (
    <div className="landing-root">
      {/* Topbar tipo Cash */}
      <div className="landing-topbar">
        <div className="landing-logo">{LANDING_TEXT.logo}</div>

        <div className="landing-actions">
          <button className="pill white">Sign up →</button>
          <button className="pill black">Log in</button>
          <button className="pill ghost">☰</button>
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

        {/* Center mock phone */}
        <div className="col center">
          <div className="phone">
            <div className="phone-screen" />
          </div>
        </div>

        {/* Right */}
        <div className="col right">
          <p>
            {rightLines.map((l, i) => (
              <span key={i}>
                {l}
                <br />
              </span>
            ))}
          </p>

          <button
  className="cta white"
  onClick={() => {
    window.location.href =
      "https://hr-beneficios-web-client-cfdshdfeeyemfmh3.canadacentral-01.azurewebsites.net/";
  }}
>
  {LANDING_TEXT.rightBtn}
</button>

        </div>
      </section>
    </div>
  );
}
