import { useCallback, useEffect, useState } from "react";
import { BeneficioApi, ToqueBeneficioApi } from "../../../services/adminApi";
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
}) {
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [showDetailMobile, setShowDetailMobile] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState();
  const [range, setRange] = useState("1W");
  const [touchTotal, setTouchTotal] = useState(0);
  const [touchSeries, setTouchSeries] = useState([]);
  const [loadingTouches, setLoadingTouches] = useState(false);
  const [touchError, setTouchError] = useState(null);

  const selectedId = selectedBenefit?.beneficioId || selectedBenefit?.id;

  
  const isLoading = Boolean(state?.loading || localLoading);
  const hasError =
    localError !== undefined ? Boolean(localError) : Boolean(state?.err);

  const handleSelect = (benefit) => {
    if (!benefit) return;
    const normalized = mapBenefitId(benefit);
    setSelectedBenefit(normalized);
    setRange("1W");
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


  const mapBenefitId = (r) => {
    const id =
      r?.id ??
      r?.Id ??
      r?.beneficioId ??
      r?.BeneficioId ??
      r?.beneficio?.id ??
      r?.beneficio?.Id;

    const fixed = String(id ?? "").trim();
    return {
      ...r,
      id: fixed || undefined,
      beneficioId: fixed || undefined,
    };
  };

  const cargarBeneficios = async () => {
    setLocalLoading(true);
    setLocalError(false);

    try {
      const data = await BeneficioApi.list();
      const normalized = Array.isArray(data) ? data.map(mapBenefitId) : [];
      accionesBeneficios?.setItems?.(normalized);
      setLocalError(false);
    } catch (err) {
      setLocalError(err || true);
    } finally {
      setLocalLoading(false);
    }
  };

  const cargarAnalytics = useCallback(async () => {
    if (!selectedId) {
      setTouchSeries([]);
      setTouchTotal(0);
      return;
    }

    setLoadingTouches(true);
    setTouchError(null);

    try {
      const data = await ToqueBeneficioApi.analytics(selectedId, range);
      setTouchTotal(data?.total ?? 0);
      setTouchSeries(Array.isArray(data?.series) ? data.series : []);
    } catch (err) {
      setTouchError(err || true);
      setTouchTotal(0);
      setTouchSeries([]);
    } finally {
      setLoadingTouches(false);
    }
  }, [range, selectedId]);

  useEffect(() => {
    cargarAnalytics();
  }, [cargarAnalytics]);

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
          items={benefits}
          selectedId={selectedId}
          onSelect={handleSelect}
          loading={isLoading}
          error={hasError}
          onRetry={cargarBeneficios}
        />

        <div className="hidden md:block">
          <BenefitDetailPanel
            benefit={selectedBenefit}
            touchesSeries={touchSeries}
            range={range}
            onRangeChange={setRange}
            touchTotal={touchTotal}
            touchError={touchError}
            touchLoading={loadingTouches}
            onRetryTouches={cargarAnalytics}
            mode="desktop"
            loading={isLoading}
          />
        </div>
      </div>

      {/* Sheet móvil con detalle */}
       <div className="md:hidden">
        <BenefitDetailPanel
          benefit={selectedBenefit}
          touchesSeries={touchSeries}
          range={range}
          onRangeChange={setRange}
          touchTotal={touchTotal}
          touchError={touchError}
          touchLoading={loadingTouches}
          onRetryTouches={cargarAnalytics}
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
