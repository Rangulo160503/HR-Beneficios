// src/components/Display.jsx
import { useState } from "react";
import BenefitCard from "./BenefitCard";
import Modal from "./Modal";
import BeneficiosCrud from "./crud/BeneficiosCrud";
import CategoriasCrud from "./crud/CategoriasCrud";
import PublicadosPreview from "./Preview/PublicadosPreview";
import CountPreview from "./Preview/CountPreview";
import BenefitDetailModal from "./modal/BenefitDetailModal";

const API_BASE = (import.meta.env.VITE_API_BASE || "https://localhost:7141").replace(/\/$/, "");

const tiles = [
  { id: "beneficios",  titulo: "Crear beneficio"},
  { id: "publicados",  titulo: "Beneficios publicados"},
  { id: "categorias",  titulo: "Crear categorías"},
  { id: "categorias-count", titulo: "Total categorías"},
];

export default function Display() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const handleOpen = (tile) => { setCurrent(tile); setOpen(true); };
  const handleClose = () => { setOpen(false); setCurrent(null); };

  const openDetail = (id) => {
    setDetailId(id);
    setDetailOpen(true);
  };
  const closeDetail = () => {
    setDetailOpen(false);
    setDetailId(null);
  };

  return (
    <main className="flex-1 bg-neutral-900 text-white">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {tiles.map((it) => (
            <BenefitCard key={it.id} item={it} onClick={handleOpen} />
          ))}
        </div>
      </div>

      <Modal
        open={open}
        title={current?.titulo || ""}
        onClose={handleClose}
      >
        {current?.id === "beneficios" && <BeneficiosCrud />}
        {current?.id === "categorias" && <CategoriasCrud />}

        {current?.id === "publicados" && (
          <PublicadosPreview onOpenDetail={openDetail} />
        )}

        {current?.id === "categorias-count" && <CountPreview />}
      </Modal>
      <Modal open={detailOpen} title="Detalle del beneficio" onClose={closeDetail}>
        <BenefitDetailModal beneficioId={detailId} />
      </Modal>
    </main>
  );
}
