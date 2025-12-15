export default function AdminHeader({ nav, onOpenMobile, onLogout }) {
  return (
    <header className="h-14 px-4 flex items-center bg-neutral-950 sticky top-0 z-10">
      {/* Ícono menú móvil */}
      <button
        className="md:hidden mr-3 p-2 rounded-lg hover:bg-white/5"
        onClick={onOpenMobile}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/90">
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Título */}
      <h1 className="font-semibold text-sm md:text-base capitalize">
        {nav}
      </h1>

      <div className="ml-auto">
        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1 text-sm rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
