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
            {/* ===================== BENEFICIOS ===================== */}
            {nav === "beneficios" && (
              <>
                {/* Card grande "Nuevo beneficio" */}
                <section>
                  <CardNew
                    onClick={() => {
                      setEditing(null);
                      setShowForm(true);
                    }}
                  />
                </section>

                {/* Lista de beneficios reales */}
                <section className="space-y-3">
                  {state.loading && (
                    <p className="text-xs text-white/50">Cargando beneficios…</p>
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

            {/* ===================== CATEGORÍAS ===================== */}
            {nav === "categorias" && (
              <section className="space-y-3">
                <h2 className="text-sm md:text-base font-semibold">
                  Categorías
                </h2>

                <ul className="space-y-2 text-sm">
                  {(cats || []).map((c, i) => {
                    const nombre =
                      c.titulo ??
                      c.nombre ??
                      c.Nombre ??
                      `Categoría ${i + 1}`;
                    return (
                      <li
                        key={c.id ?? c.categoriaId ?? c.CategoriaId ?? i}
                        className="rounded-xl bg-neutral-900  px-3 py-2"
                      >
                        {nombre}
                      </li>
                    );
                  })}

                  {(cats || []).length === 0 && (
                    <li className="text-xs text-white/50">
                      No hay categorías registradas.
                    </li>
                  )}
                </ul>
              </section>
            )}

            {/* ===================== PROVEEDORES ===================== */}
            {nav === "proveedores" && (
              <section className="space-y-3">
                <h2 className="text-sm md:text-base font-semibold">
                  Proveedores
                </h2>

                <ul className="space-y-2 text-sm">
                  {(provs || []).map((p, i) => {
                    const nombre = p.nombre ?? p.Nombre ?? `Proveedor ${i + 1}`;
                    return (
                      <li
                        key={p.id ?? p.proveedorId ?? p.ProveedorId ?? i}
                        className="rounded-xl bg-neutral-900  px-3 py-2"
                      >
                        {nombre}
                      </li>
                    );
                  })}

                  {(provs || []).length === 0 && (
                    <li className="text-xs text-white/50">
                      No hay proveedores registrados.
                    </li>
                  )}
                </ul>
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
