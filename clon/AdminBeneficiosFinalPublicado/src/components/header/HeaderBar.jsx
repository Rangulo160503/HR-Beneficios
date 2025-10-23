import React from "react";

export default function HeaderBar({ nav, setShowMobileNav, query, setQuery, IconMenu, IconSearch }) {
  return (
    <div className="h-14 md:h-16 flex items-center gap-2 md:gap-3 px-3 md:px-6 border-b border-white/10 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
      
      {/* botón menú móvil */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-white/5 -ml-1"
        onClick={() => setShowMobileNav(true)}
        aria-label="Abrir menú"
      >
        <IconMenu className="w-6 h-6 text-white/90" />
      </button>

      <h1 className="font-semibold capitalize hidden sm:block">{nav}</h1>

      {/* 🔍 Searchbar - visible tanto en desktop como en móvil */}
      {nav === "beneficios" && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="ml-auto flex-1 max-w-xs md:max-w-md"
        >
          <div className="relative w-full">
            <IconSearch className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              placeholder="Buscar beneficios"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-6 pr-2 py-1.5 w-full bg-transparent border-0 border-b border-white/10 
                         text-white placeholder-white/50 outline-none focus:border-white/30 
                         transition-colors"
            />
          </div>
        </form>
      )}
    </div>
  );
}
