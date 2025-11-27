export default function HeaderBar({ nav, setShowMobileNav }) {
  return (
    <header className="h-14 px-4 flex items-center bg-neutral-950 sticky top-0 z-10">
      {/* botón menú solo en móvil */}
      <button
        className="md:hidden mr-3 p-2 rounded-lg hover:bg-white/5"
        onClick={() => setShowMobileNav && setShowMobileNav(true)}
        aria-label="Abrir menú"
      >
        <svg
          className="w-6 h-6 text-white/90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="font-semibold text-sm md:text-base capitalize text-white">
        {nav}
      </h1>
    </header>
  );
}
