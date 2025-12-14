import { useState } from "react";
import IntroLandingTransition from "./components/IntroLandingTransition/IntroLandingTransition";
import EpicPreview from "./components/EpicPreview";


export default function App() {

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

     
      <IntroLandingTransition
        accessOptions={accessOptions}
        onOpenPreview={() => setPreviewOpen(true)}
      />

   
      <EpicPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

   
    </div>
  );

}