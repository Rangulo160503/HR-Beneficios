// src/components/AdminShell/pages/CategoriasPage.jsx
export default function CategoriasPage({ cats = [], addCategoria }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={async () => { await addCategoria?.(); }}
          className="px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10"
        >
          + Nueva
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 divide-y divide-white/5">
        {cats.map((c) => (
          <div
            key={c.id ?? c.categoriaId}
            className="px-4 py-3 flex items-center text-sm"
          >
            <span className="flex-1 truncate">
              {c.nombre ?? c.titulo ?? c.Nombre ?? c.Titulo}
            </span>
            <button className="ml-2 px-2 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10">
              Renombrar
            </button>
            <button className="ml-2 px-2 py-1 rounded-full text-xs bg-white/5 hover:bg-red-500/20 text-red-300/90">
              Eliminar
            </button>
          </div>
        ))}

        {cats.length === 0 && (
          <p className="px-4 py-6 text-xs text-white/40">
            Aún no hay categorías registradas.
          </p>
        )}
      </div>
    </section>
  );
}
