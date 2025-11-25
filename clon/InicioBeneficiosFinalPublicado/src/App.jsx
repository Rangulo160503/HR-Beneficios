import { useState } from "react";
import Display from "./components/Display";          // ← ahora usa la carpeta nueva
import IntroSplash from "./components/IntroSplash";
import LandingIntro from "./components/LandingIntro";
import EpicPreview from "./components/EpicPreview";

export default function App() {
  // intro → landing → app
  const [stage, setStage] = useState("intro"); 
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Pantalla inicial tipo Cash App */}
      <IntroSplash
        show={stage === "intro"}
        onFinish={() => setStage("landing")}
      />

      {/* Landing verde con botones */}
      {stage === "landing" && (
        <>
          <LandingIntro
            onOpenPreview={() => setPreviewOpen(true)}
            onEnterApp={() => setStage("app")}
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
