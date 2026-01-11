import { useEffect, useRef, useState } from "react";
import IntroSplash from "../IntroSplash";
import IntroSplashCard from "../IntroSplash/IntroSplashCard";
import LandingIntro from "../LandingIntro";
import LandingIntroCard from "../LandingIntro/LandingIntroCard";
import { LANDING_TEXT } from "../LandingIntro/constants";
import "./IntroLandingTransition.css";

const MOTION_DURATION = 900;

export default function IntroLandingTransition({ accessOptions, onOpenPreview }) {
  const [stage, setStage] = useState("intro");          // intro | transition | landing
  const [overlayActive, setOverlayActive] = useState(false);
  const [playFlip, setPlayFlip] = useState(false);
  const [backgroundPhase, setBackgroundPhase] = useState("intro");

  const landingCardRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (stage !== "transition") return;

    const last = landingCardRef.current?.getBoundingClientRect();
    const wrapEl = wrapRef.current;

    if (!last || !wrapEl) {
      setStage("landing");
      return;
    }

    // 1️⃣ Activamos overlay y fondo
    setOverlayActive(true);
    setBackgroundPhase("fade");

    // 2️⃣ Fijamos tamaño final (estable)
    wrapEl.style.width = `${last.width}px`;
    wrapEl.style.height = `${last.height}px`;
    wrapEl.style.transformOrigin = "top left";
    wrapEl.style.transition = "none";

    // 3️⃣ Posición inicial: ARRIBA, fuera de pantalla
    const startLeft = last.left;
    const startTop = -last.height - 40;

    wrapEl.style.transform = `translate(${startLeft}px, ${startTop}px)`;

    // 4️⃣ Siguiente frame → bajada animada + flip
    requestAnimationFrame(() => {
      wrapEl.style.transition = `transform ${MOTION_DURATION}ms cubic-bezier(.16,1,.3,1)`;
      wrapEl.style.transform = `translate(${last.left}px, ${last.top}px)`;
      setPlayFlip(true);
    });

    // 5️⃣ Finalizar transición
    const timer = setTimeout(() => {
      setStage("landing");
      setOverlayActive(false);
      setPlayFlip(false);
      setBackgroundPhase("done");
    }, MOTION_DURATION + 80);

    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <>
      <IntroSplash
        show={stage !== "landing"}
        onFinish={() => {
          if (stage === "intro") setStage("landing");
        }}
        onPhaseChange={(phase) => {
          if (phase === "phase-2" && stage === "intro") {
            setStage("transition");
          }
        }}
      />

      {stage !== "intro" && (
        <LandingIntro
          accessOptions={accessOptions}
          onOpenPreview={onOpenPreview}
          cardRef={landingCardRef}
          visible={stage === "landing"}
          placeholder={stage !== "landing"}
        />
      )}

      {overlayActive && (
        <div className="transition-layer">
          <div className={`bg-layer black ${backgroundPhase}`} />
          <div className={`bg-layer green ${backgroundPhase}`} />

          <div className="flip-wrap" ref={wrapRef}>
            <div className={`flip-inner ${playFlip ? "play" : ""}`}>
              <div className="face front">
                <IntroSplashCard />
              </div>
              <div className="face back">
                <LandingIntroCard
                  kicker={LANDING_TEXT.kicker}
                  title={LANDING_TEXT.panelTitle}
                  subtitle={LANDING_TEXT.panelSubtitle}
                  options={accessOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
