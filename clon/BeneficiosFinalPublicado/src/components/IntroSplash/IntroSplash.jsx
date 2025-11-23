import "./IntroSplash.css";
import { useIntroSplash } from "./useIntroSplash";
import { INTRO_TEXT } from "./constants";

export default function IntroSplash({ show, onFinish }) {
  const { phase, hide } = useIntroSplash(show, onFinish);

  if (!show) return null;

  return (
    <div className={`intro ${phase} ${hide ? "hide" : ""}`}>
      <div className="intro-black" />
      <div className="intro-green" />

      <div className="intro-card">
        <div className="card-inner">
          <div className="card-tag">{INTRO_TEXT.tag}</div>

          <div className="card-title">
            {INTRO_TEXT.title.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>

          <div className="card-chips">
            <span className="chip"></span>
            <span className="chip wide"></span>
          </div>
        </div>
      </div>

      <div className="intro-glow" />
    </div>
  );
}
