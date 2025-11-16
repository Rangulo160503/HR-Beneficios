// src/components/AdminShell.jsx
import { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import MobileSidebar from "./sidebar/MobileSidebar";
import CardNew from "./beneficio/CardNew";
import CardBeneficio from "./beneficio/CardBeneficio";
import FullForm from "./beneficio/FullForm";
import { useBeneficios } from "../hooks/useBeneficios";
import { useCatalogos } from "../hooks/useCatalogos";

// Icono menú hamburguesa para el header móvil
const IconMenu = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function AdminShell() {
  const [nav, setNav] = useState("beneficios");
  const [collapsed, setCollapsed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // menú lateral en móvil
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Beneficios reales
  const { state, actions } = useBeneficios();
  const beneficios = state.filtered ?? state.items ?? [];

  // Catálogos (categorías y proveedores)
  const {
    cats,
    provs,
    addCategoria,
    addProveedor,
    // rename/delete los puedes usar luego si se ocupan
  } = useCatalogos();

  // items reutilizados por el MobileSidebar
  const mobileItems = [
    { key: "beneficios", label: "Beneficios" },
    { key: "categorias", label: "Categorías" },
    { key: "proveedores", label: "Proveedores" },
    { key: "hrportal", label: "HR Portal", href: "http://hrportal" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      {/* Sidebar escritorio */}
      <Sidebar
        nav={nav}
        onChangeNav={setNav}
        collapsed={collapsed}
        onToggleCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 px-4 flex items-center bg-neutral-950 sticky top-0 z-10 ">
          {/* botón menú solo en móvil */}
          <button
            className="md:hidden mr-3 p-2 rounded-lg hover:bg-white/5"
            onClick={() => setShowMobileNav(true)}
            aria-label="Abrir menú"
          >
            <IconMenu className="w-6 h-6 text-white/90" />
          </button>

          <h1 className="font-semibold text-sm md:text-base capitalize">
            {nav}
          </h1>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="pt-4 px-4 md:px-6 space-y-4">
            {/* ====================== BENEFICIOS ====================== */}
            {nav === "beneficios" && (
              <>
                <section>
                  <CardNew
                    onClick={() => {
                      setEditing(null);
                      setShowForm(true);
                    }}
                  />
                </section>

                <section className="space-y-3">
                  {state.loading && (
                    <p className="text-xs text-white/50">
                      Cargando beneficios…
                    </p>
                  )}

                  {state.err && (
                    <p className="text-xs text-red-400">
                      Error al cargar beneficios.
                    </p>
                  )}

                  {!state.loading &&
                    beneficios.map((b) => (
                      <CardBeneficio
                        key={b.id}
                        item={b}
                        onEdit={() => {
                          setEditing(b);
                          setShowForm(true);
                        }}
                        onDelete={async () => {
                          await actions.remove(b.id);
                        }}
                      />
                    ))}

                  {!state.loading && !state.err && beneficios.length === 0 && (
                    <p className="text-xs text-white/50">
                      No hay beneficios aún.
                    </p>
                  )}
                </section>
              </>
            )}

            {/* ====================== CATEGORÍAS ====================== */}
            {nav === "categorias" && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Categorías</h2>
                  <button
                    onClick={async () => { await addCategoria(); }}
                    className="px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    + Nueva
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 divide-y divide-white/5">
                  {(cats || []).map((c) => (
                    <div
                      key={c.id ?? c.categoriaId}
                      className="px-4 py-3 flex items-center text-sm"
                    >
                      <span className="flex-1 truncate">
                        {c.nombre ?? c.titulo ?? c.Nombre ?? c.Titulo}
                      </span>

                      {/* botones reales de renombrar/eliminar los conectamos
                          cuando veamos los helpers de useCatalogos */}
                      <button
                        className="ml-2 px-2 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10"
                      >
                        Renombrar
                      </button>
                      <button
                        className="ml-2 px-2 py-1 rounded-full text-xs bg-white/5 hover:bg-red-500/20 text-red-300/90"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}

                  {(cats || []).length === 0 && (
                    <p className="px-4 py-6 text-xs text-white/40">
                      Aún no hay categorías registradas.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* ====================== PROVEEDORES ====================== */}
            {nav === "proveedores" && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Proveedores</h2>
                  <button
                    onClick={async () => { await addProveedor(); }}
                    className="px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    + Nuevo
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 divide-y divide-white/5">
                  {(provs || []).map((p) => (
                    <div
                      key={p.id ?? p.proveedorId}
                      className="px-4 py-3 flex items-center text-sm"
                    >
                      <span className="flex-1 truncate">
                        {p.nombre ?? p.Nombre}
                      </span>

                      <button
                        className="ml-2 px-2 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10"
                      >
                        Renombrar
                      </button>
                      <button
                        className="ml-2 px-2 py-1 rounded-full text-xs bg-white/5 hover:bg-red-500/20 text-red-300/90"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}

                  {(provs || []).length === 0 && (
                    <p className="px-4 py-6 text-xs text-white/40">
                      Aún no hay proveedores registrados.
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        </main>


        {/* Formulario de crear/editar beneficio */}
        {showForm && (
          <FullForm
            initial={editing}
            provs={provs || []}
            cats={cats || []}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onCreateCat={async () => await addCategoria()}
            onCreateProv={async () => await addProveedor()}
            onSave={async (dto) => {
              await actions.save(dto, editing);
              setShowForm(false);
              setEditing(null);
            }}
          />
        )}

        {/* Sidebar móvil tipo YouTube */}
        <MobileSidebar
          open={showMobileNav}
          current={nav}
          items={mobileItems}
          onSelect={(key) => {
            if (key === "hrportal") {
              window.open("http://hrportal", "_blank", "noopener,noreferrer");
              return;
            }
            setNav(key);
          }}
          onClose={() => setShowMobileNav(false)}
        />
      </div>
    </div>
  );
}
