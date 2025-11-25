// src/components/Display/BenefitsGrid.jsx
import BenefitCard from "../BenefitCard";

export default function BenefitsGrid({
  loading,
  filtered,
  error,
  onSelectBenefit,
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3 animate-pulse"
              >
                <div className="h-40 w-full rounded-xl bg-white/10" />
                <div className="mt-3 h-4 w-3/4 rounded bg-white/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
                <div className="mt-4 h-3 w-2/3 rounded bg-white/10" />
              </div>
            ))
          : filtered.map((it) => (
              <BenefitCard key={it.id} item={it} onClick={() => onSelectBenefit(it)} />
            ))}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div className="mt-8 text-center text-white/60">
          No se encontraron beneficios.
        </div>
      )}
    </>
  );
}
