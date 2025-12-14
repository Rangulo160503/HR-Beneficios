import "./IntroSplash.css";
import { useIntroSplash } from "./useIntroSplash";
import IntroSplashCard from "./IntroSplashCard";


export default function IntroSplash({ show, onFinish, onPhaseChange }) {
  const { phase, hide } = useIntroSplash(show, onFinish, onPhaseChange);

  if (!show) return null;

  return (
    <div className={`intro ${phase} ${hide ? "hide" : ""}`}>
      <div className="intro-black" />
      <div className="intro-green" />

      <div className="intro-card">
        <IntroSplashCard />
      </div>

      <div className="intro-glow" />
    </div>
  );
}