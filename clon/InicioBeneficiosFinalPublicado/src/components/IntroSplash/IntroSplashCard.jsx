import "./IntroSplash.css";
import { INTRO_TEXT } from "./constants";

export default function IntroSplashCard() {
  return (
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
  );
}