// src/components/AdminShell/pages/DashboardBeneficios.jsx
import { useState } from "react";
import BenefitsList from "./BenefitsList";
import BenefitDetailPanel from "./BenefitDetailPanel";
import FullForm from "../../beneficio/FullForm";

export default function DashboardBeneficios({
  state,
  benefits,
  accionesBeneficios,
  cats,
  provs,
  addCategoria,
  addProveedor,
  showForm,
  setShowForm,
  editing,
  setEditing,
  statsPorBeneficio,
}) {
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [showDetailMobile, setShowDetailMobile] = useState(false);

  const isLoading = state?.loading;
  const hasError = !!state?.err;

  const handleSelect = (benefit) => {
    setSelectedBenefit(benefit);
    setShowDetailMobile(true);
  };

  const handleCloseDetail = () => {
    setShowDetailMobile(false);
  };

  const openNew = () => {
    setEditing?.(null);
    setShowForm?.(true);
  };

  const handleSave = async (dto) => {
    if (!accionesBeneficios?.save) return;
    await accionesBeneficios.save(dto, editing);
    setShowForm?.(false);
    setEditing?.(null);
  };

  // si tu hook tiene alguna acción para recargar, puedes usarla aquí:
  const handleRetry = async () => {
    if (accionesBeneficios?.reload) {
      await accionesBeneficios.reload();
    } else if (accionesBeneficios?.fetch) {
      await accionesBeneficios.fetch();
    } else {
      console.warn("No hay acción de recarga configurada todavía");
    }
  };

  const touchesSeries =
    selectedBenefit && statsPorBeneficio
      ? statsPorBeneficio[selectedBenefit.id] || []
      : [];

  return (
    <>
      {/* Botón Nuevo beneficio */}
      <div className="flex items-center justify-end">
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-xs md:text-sm font-medium"
        >
          + Nuevo beneficio
        </button>
      </div>

      {/* Layout responsive: lista + panel */}
      <div className="grid md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] gap-4">
        <BenefitsList
          items={benefits || []}
          selectedId={selectedBenefit?.id}
          onSelect={handleSelect}
          loading={isLoading}
          error={hasError}
          onRetry={handleRetry}
        />

        <div className="hidden md:block">
          <BenefitDetailPanel
            benefit={selectedBenefit}
            touchesSeries={touchesSeries}
            mode="desktop"
            loading={isLoading}
          />
        </div>
      </div>

      {/* Sheet móvil con detalle */}
       <div className="md:hidden">
        <BenefitDetailPanel
          benefit={selectedBenefit}
          touchesSeries={touchesSeries}
          mode="mobile-sheet"
          visible={showDetailMobile}
          onClose={handleCloseDetail}
          loading={isLoading}
        />
      </div>

      {/* Formulario crear / editar beneficio */}
      {showForm && (
        <FullForm
          initial={editing}
          provs={provs || []}
          cats={cats || []}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onCreateCat={async () => await addCategoria?.()}
          onCreateProv={async () => await addProveedor?.()}
          onSave={handleSave}
        />
      )}
    </>
  );
}
