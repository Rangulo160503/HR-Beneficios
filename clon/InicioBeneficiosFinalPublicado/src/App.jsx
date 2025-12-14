import { useState } from "react";
import Display from "./components/Display";          // ← ahora usa la carpeta nueva
import IntroSplash from "./components/IntroSplash";
import LandingIntro from "./components/LandingIntro";
import EpicPreview from "./components/EpicPreview";
import IntroToLandingFlip from "./components/IntroLandingTransition/IntroToLandingFlip";
import { LANDING_TEXT } from "./components/LandingIntro/constants";

export default function App() {
  // intro → landing → app
  const [stage, setStage] = useState("intro");
  const [previewOpen, setPreviewOpen] = useState(false);

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
    <div className="min-h-screen bg-black text-white">

      {/* Pantalla inicial tipo Cash App */}
      <IntroSplash
        show={stage !== "landing"}
        onFinish={() => {
          if (stage === "intro") setStage("landing");
        }}
        onPhaseChange={(phase) => {
          if (phase === "phase-2" && stage === "intro") {
            setStage("flip");
          }
        }}
      />

      <IntroToLandingFlip
        active={stage === "flip"}
        backCopy={{
          kicker: LANDING_TEXT.kicker,
          title: LANDING_TEXT.panelTitle,
          subtitle: LANDING_TEXT.panelSubtitle,
          options: accessOptions,
        }}
        onComplete={() => setStage("landing")}
      />

      {/* Landing verde con botones */}
      {stage === "landing" && (
        <>
          <LandingIntro
            accessOptions={accessOptions}
            onOpenPreview={() => setPreviewOpen(true)}
          />
          <EpicPreview
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
          />
        </>
      )}

      {/* App real (Display ya modularizado) */}
      {stage === "app" && (
        <div className="h-full flex overflow-x-hidden">
          <main className="flex-1 min-w-0">
            <Display />
          </main>
        </div>
      )}
    </div>
  );
}