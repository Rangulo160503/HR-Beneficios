// src/components/BenefitCard.jsx
// Tarjeta reutilizable para mostrar un beneficio

export default function BenefitCard({ item, onClick }) {
  const hideOnError = (e) => (e.currentTarget.style.display = "none");

  return (
    <button
      onClick={() => onClick?.(item)}
      className="w-full rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition p-2 text-left"
      aria-label={item?.titulo}
    >
      <div className="relative">
        {item?.imagen ? (
          <img
            src={item.imagen}
            alt={item.titulo}
            loading="lazy"
            onError={hideOnError}
            className="aspect-square w-full rounded-xl object-cover"
          />
        ) : (
          <div className="aspect-square w-full rounded-xl bg-white/10" />
        )}
      </div>

      <div className="mt-2 space-y-0.5">
        <div className="line-clamp-2 text-[0.95rem] font-semibold leading-snug">
          {item?.titulo}
        </div>
      </div>
    </button>
  );
}
