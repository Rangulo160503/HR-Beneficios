import { useState } from "react";
import IntroLandingTransition from "./IntroLandingTransition/IntroLandingTransition";
import EpicPreview from "./EpicPreview";

const TARGET = import.meta.env.VITE_PORTAL_TARGET || "local";

const cfg = {
  local: {
    colaboradores: import.meta.env.VITE_CLIENT_PORTAL_BASE_LOCAL || "http://localhost:5173",
    proveedores: import.meta.env.VITE_PROV_PORTAL_BASE_LOCAL || "http://localhost:5173",
    admin: import.meta.env.VITE_ADMIN_PORTAL_BASE_LOCAL || "http://localhost:5174",
  },
  cloud: {
    colaboradores: import.meta.env.VITE_CLIENT_PORTAL_BASE_CLOUD,
    proveedores: import.meta.env.VITE_PROV_PORTAL_BASE_CLOUD,
    admin: import.meta.env.VITE_ADMIN_PORTAL_BASE_CLOUD,
  },
};

export default function LandingShell() {
  const [previewOpen, setPreviewOpen] = useState(false);

  const base = cfg[TARGET] ?? cfg.local;

  const accessOptions = [
    { label: "Colaboradores", href: `${base.colaboradores}/` },
    { label: "Proveedores", href: `${base.proveedores}/` },
    { label: "Administración", href: `${base.admin}/admin/login` },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <IntroLandingTransition
        accessOptions={accessOptions}
        onOpenPreview={() => setPreviewOpen(true)}
      />

      <EpicPreview open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
