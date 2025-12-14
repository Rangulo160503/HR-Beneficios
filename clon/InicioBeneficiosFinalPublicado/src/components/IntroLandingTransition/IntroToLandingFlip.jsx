import "./IntroToLandingFlip.css";
import IntroSplashCard from "../IntroSplash/IntroSplashCard";
import LandingIntroCard from "../LandingIntro/LandingIntroCard";

export default function IntroToLandingFlip({ active, onComplete, backCopy }) {
  if (!active) return null;

  return (
    <div className="flip-overlay">
      <div className="flip-scene">
        <div className="flip-card animate" onAnimationEnd={onComplete}>
          <div className="flip-face front">
            <IntroSplashCard />
          </div>

          <div className="flip-face back">
            <LandingIntroCard
              kicker={backCopy?.kicker}
              title={backCopy?.title}
              subtitle={backCopy?.subtitle}
              options={backCopy?.options || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}