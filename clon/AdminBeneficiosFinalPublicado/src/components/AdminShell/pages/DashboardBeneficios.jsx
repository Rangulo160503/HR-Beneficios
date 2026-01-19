import { useCallback, useEffect, useState } from "react";
import BenefitsList from "./BenefitsList";
import BenefitDetailPanel from "./BenefitDetailPanel";
import BenefitEditModal from "./BenefitEditModal";
import {
  loadBeneficiosList,
  loadToqueAnalytics,
  loadToqueSummary,
} from "../../../core-config/useCases";

export default function DashboardBeneficios({
  state,
  benefits,
  accionesBeneficios,
}) {
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [showDetailMobile, setShowDetailMobile] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState();
  const [range, setRange] = useState("1W");
  const [touchTotal, setTouchTotal] = useState(0);
  const [touchSeries, setTouchSeries] = useState([]);
  const [touchAnalytics, setTouchAnalytics] = useState(null);
  const [touchSummary, setTouchSummary] = useState({});
  const [loadingTouches, setLoadingTouches] = useState(false);
  const [touchError, setTouchError] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const selectedId = selectedBenefit?.beneficioId || selectedBenefit?.id;

  
  const isLoading = Boolean(state?.loading || localLoading);
  const hasError =
    localError !== undefined ? Boolean(localError) : Boolean(state?.err);

  const handleSelect = (benefit) => {
    if (!benefit) return;
    setSelectedBenefit(benefit);
    setRange("1W");
    setShowDetailMobile(true);
  };

  const handleCloseDetail = () => {
    setShowDetailMobile(false);
  };

  const handleEditSaved = (updated) => {
    if (!updated) return;
    const normalized = updated;
    accionesBeneficios?.setItems?.((prev = []) =>
      prev.map((b) =>
        b.beneficioId === normalized.beneficioId ? normalized : b
      )
    );
    setSelectedBenefit((prev) => {
      if (!prev) return prev;
      return prev.beneficioId === normalized.beneficioId
        ? { ...prev, ...normalized }
        : prev;
    });
  };

  const cargarBeneficios = async () => {
    setLocalLoading(true);
    setLocalError(false);

    try {
      const normalized = await loadBeneficiosList();
      accionesBeneficios?.setItems?.(normalized);
      await cargarResumen(normalized);
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
      setTouchAnalytics(null);
      return;
    }

    setLoadingTouches(true);
    setTouchError(null);

    try {
      const data = await loadToqueAnalytics({ beneficioId: selectedId, range });
      setTouchTotal(data?.total ?? data?.Total ?? 0);
      setTouchSeries(Array.isArray(data?.series) ? data.series : []);
      setTouchAnalytics(data || null);
    } catch (err) {
      setTouchError(err || true);
      setTouchTotal(0);
      setTouchSeries([]);
      setTouchAnalytics(null);
    } finally {
      setLoadingTouches(false);
    }
  }, [range, selectedId]);

  const cargarResumen = useCallback(
    async (benefitsSnapshot) => {
      try {
        const baseBenefits = benefitsSnapshot ?? benefits ?? [];
        const { summary, beneficios: merged } = await loadToqueSummary({
          range,
          beneficios: baseBenefits,
        });
        setTouchSummary(summary);

accionesBeneficios?.setItems?.((prev = []) => {
  // Si el backend te manda merged con los toques, creamos un mapa por id
  const byId = new Map((merged ?? []).map(b => [b.beneficioId ?? b.id, b]));

  // Retornamos la misma lista, mismos objetos base, pero parchando solo los campos de toques
  return prev.map((b) => {
    const id = b.beneficioId ?? b.id;
    const next = byId.get(id);
    if (!next) return b;

    // 👇 Solo copiar lo que afecta “contador”, NO reescribir todo el beneficio
    return {
      ...b,
      toquesTotal: next.toquesTotal ?? next.toques ?? b.toquesTotal,
      // si hay más métricas, solo esas:
      // toquesSemana: next.toquesSemana ?? b.toquesSemana,
      // ultimoToque: next.ultimoToque ?? b.ultimoToque,
    };
  });
});
      } catch (err) {
        console.error("No se pudo cargar el resumen de toques", err);
      }
    },
    [accionesBeneficios, benefits, range]
  );

  useEffect(() => {
    cargarAnalytics();
  }, [cargarAnalytics]);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  return (
    <>
      {/* Layout responsive: lista + panel */}
      <div className="grid md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] gap-4">
        <BenefitsList
          items={benefits}
          selectedId={selectedId}
          onSelect={handleSelect}
          onEdit={(b) => setEditTarget(b)}
          loading={isLoading}
          error={hasError}
          onRetry={cargarBeneficios}
        />

        <div className="hidden md:block">
          <BenefitDetailPanel
            benefit={selectedBenefit}
            touchesSeries={touchSeries}
            touchesAnalytics={touchAnalytics}
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
          touchesAnalytics={touchAnalytics}
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

      <BenefitEditModal
        open={Boolean(editTarget)}
        benefit={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={handleEditSaved}
      />
    </>
  );
}
