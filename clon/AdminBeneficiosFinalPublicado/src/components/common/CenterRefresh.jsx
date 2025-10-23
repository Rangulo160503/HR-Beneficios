// src/components/common/CenterRefresh.jsx
export default function CenterRefresh({ label = "Actualizar", onClick }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center pointer-events-auto">
      <button
        type="button"
        onClick={onClick}
        className="group flex flex-col items-center gap-3 focus:outline-none"
        aria-label={label}
      >
        <div className="relative">
          {/* Halo suave detrás */}
          <div
            className="absolute -inset-6 rounded-full blur-2xl opacity-30"
            style={{ background: "radial-gradient(closest-side, rgba(255,255,255,.15), transparent)" }}
          />
          {/* Ícono refresh girando */}
          <svg
            viewBox="0 0 24 24"
            className="relative w-12 h-12 text-white/90 group-hover:text-white transition-colors animate-spin"
            aria-hidden="true"
          >
            <path
              d="M4 4v6h6M20 20v-6h-6"
              stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
            <path
              d="M4 10a8 8 0 0112-6.9M20 14a8 8 0 01-12 6.9"
              stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-sm tracking-wide text-white/80 group-hover:text-white">
          {label}
        </span>
      </button>
    </div>
  );
}
