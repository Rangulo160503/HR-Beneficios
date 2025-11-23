// src/components/Display/DisplayHeader.jsx
export default function DisplayHeader({
  headerRef,
  headerY,
  scrolled,
  busqueda,
  setBusqueda,
  searchOpen,
  setSearchOpen,
  setFormOpen,
  categoriasLen,
  proveedoresLen,
}) {
  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 z-40 bg-black/80 backdrop-blur ${
        scrolled ? "border-b border-white/10" : "border-b border-transparent"
      }`}
      style={{ transform: `translateY(${headerY}px)`, willChange: "transform" }}
    >
      {/* Desktop */}
      <div className="hidden sm:flex mx-auto w-full max-w-7xl h-16 px-4 items-center gap-4">
        <span className="text-cian-500 font-bold text-xl">Beneficios</span>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar beneficios..."
              className="w-full h-10 rounded-full bg-white/10 border border-white/10 px-4 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setFormOpen(true)}
            className="hidden sm:inline-flex h-9 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10 transition"
          >
            Contacto
          </button>
        </div>
      </div>

      {/* Móvil */}
      <div className="sm:hidden">
        {!searchOpen ? (
          <div className="h-14 px-4 flex items-center justify-between">
            <span className="text-cian-500 font-bold text-xl">Beneficios</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1 rounded-full hover:bg-white/20 transition"
                aria-label="Abrir búsqueda"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  className="h-6 w-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(false)}
                className="shrink-0 p-2 rounded-full hover:bg-white/20 transition"
                aria-label="Cerrar búsqueda"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  className="h-5 w-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar beneficios..."
                className="flex-1 h-9 rounded-xl bg-white/10 border border-white/10 px-3 text-base placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
