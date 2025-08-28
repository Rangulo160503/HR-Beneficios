import { useEffect, useState } from "react";
import { fetchBeneficios } from "../services/beneficiosService.js";
import BenefitCard from "./BenefitCard";
import Modal from "./Modal";
import BenefitDetailModal from "./modal/BenefitDetailModal";

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/5 p-2">
      <div className="aspect-square w-full rounded-xl animate-pulse bg-white/10" />
      <div className="mt-2 space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

export default function Display() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // estado para el modal de detalle
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openDetail = (id) => {
    setSelectedId(id);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedId(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBeneficios();
        const map = (x) => ({
          id: x.beneficioId ?? x.BeneficioId,
          titulo: x.titulo ?? x.Titulo,
          proveedor: x.proveedorNombre ?? x.ProveedorNombre,
          imagen: x.imagenUrl ?? x.ImagenUrl,
        });
        setItems(Array.isArray(data) ? data.map(map) : []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los beneficios.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="flex-1 bg-neutral-900 text-white">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-4">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((it) => (
                <BenefitCard
                  key={it.id}
                  item={it}
                  onClick={() => openDetail(it.id)}  // 👈 abre el modal
                />
              ))}
        </div>

        {!loading && !items.length && (
          <div className="mt-8 text-center text-white/60">
            No hay beneficios publicados.
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      <Modal open={detailOpen} title="Detalle del beneficio" onClose={closeDetail}>
        {selectedId && <BenefitDetailModal beneficioId={selectedId} />}
      </Modal>
    </main>
  );
}
