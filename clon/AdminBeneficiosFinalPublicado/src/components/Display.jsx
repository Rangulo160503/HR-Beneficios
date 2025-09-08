// src/components/Display.jsx
import { useState } from "react";
import BenefitCard from "./BenefitCard";
import Modal from "./Modal";

// Bloques CRUD (mantén/ajusta estas rutas según tu proyecto)
import BeneficiosCrud from "./crud/BeneficiosCrud";
import CategoriasCrud from "./crud/CategoriasCrud";
import ProveedoresCrud from "./crud/ProveedoresCrud"; // ⬅️ nuevo (skeleton más abajo)

const tiles = [
  { id: "beneficios",  titulo: "Beneficios" },
  { id: "categorias",  titulo: "Categorías" },
  { id: "proveedores", titulo: "Proveedores" },
];

export default function Display() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const handleOpen = (tile) => { setCurrent(tile); setOpen(true); };
  const handleClose = () => { setOpen(false); setCurrent(null); };

  return (
    <main className="flex-1 bg-neutral-900 text-white">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {tiles.map((it) => (
            <BenefitCard key={it.id} item={it} onClick={handleOpen} />
          ))}
        </div>
      </div>

      <Modal open={open} title={current?.titulo || ""} onClose={handleClose}>
        {current?.id === "beneficios"  && <BeneficiosCrud />}
        {current?.id === "categorias"  && <CategoriasCrud />}
        {current?.id === "proveedores" && <ProveedoresCrud />}
      </Modal>
    </main>
  );
}
