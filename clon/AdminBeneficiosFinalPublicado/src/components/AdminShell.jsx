// src/components/AdminShell.jsx
import { useEffect, useMemo, useState } from "react";
import HeaderBar from "./header/HeaderBar";
import MobileSidebar from "./sidebar/MobileSidebar";
import Sidebar from "./sidebar/Sidebar";
import CardNew from "./beneficio/CardNew";
import CardBeneficio from "./beneficio/CardBeneficio";
import FullForm from "./beneficio/FullForm";
import Alert from "./common/Alert";
import SimpleList from "./common/SimpleList";
import FiltersBar from "./beneficio/FiltersBar";
import { useBeneficios } from "../hooks/useBeneficios";
import { useCatalogos } from "../hooks/useCatalogos";

const IconMenu=(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/></svg>);
const IconSearch=(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M20 20l-4.2-4.2" strokeWidth="2" strokeLinecap="round"/></svg>);
const IconGift=(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="1.8"/><path d="M12 8v13M3 12h18" strokeWidth="1.8"/></svg>);
const IconTag=(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><path d="M20 13.5 10.5 4H5v5.5L14.5 19a2.1 2.1 0 0 0 3 0L20 16.5a2.1 2.1 0 0 0 0-3z" strokeWidth="1.8"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>);
const IconBuilding=(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.8"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M4 19h16" strokeWidth="1.8"/></svg>);

const LS_SIDEBAR = "admin.sidebar.collapsed";

export default function AdminShell() {
  const { state, actions } = useBeneficios();
  const {
    cats, provs, loading: loadingCatsProvs, err: errCatsProvs,
    addCategoria, renameCategoria, deleteCategoria,
    addProveedor, renameProveedor, deleteProveedor
  } = useCatalogos();
  // 🔍 Diagnóstico de filtros y datos
console.log({
  items: state.items.length,
  selCat: state.selCat,
  selProv: state.selProv,
  filtered: state.filtered.length,
  query: state.query
});

  const [nav, setNav] = useState("beneficios");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Modal
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(LS_SIDEBAR) === "1"); } catch {}
  }, []);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.documentElement.style.overflow = showForm ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [showForm]);

  const mobileItems = [
    { key:"beneficios",  label:"Beneficios",  icon:<IconGift className="w-5 h-5"/>,     level:0 },
    { key:"categorias",  label:"Categorías",  icon:<IconTag className="w-5 h-5"/>,      level:1 },
    { key:"proveedores", label:"Proveedores", icon:<IconBuilding className="w-5 h-5"/>, level:1 },
    { key:"hrportal",    label:"HR Portal",   icon:<IconBuilding className="w-5 h-5"/>, level:0 },
  ];

  // Handlers modal
  function openNew() { setEditing(null); setShowForm(true); }
  async function openEdit(it) { setEditing(it); setShowForm(true); }

  return (
    <div className={`min-h-screen bg-neutral-950 text-white md:grid ${collapsed ? "md:grid-cols-[64px_1fr]" : "md:grid-cols-[260px_1fr]"}`}>
      {/* Sidebar */}
      <Sidebar
        nav={nav}
        onChangeNav={(k)=>{ if(k==="hrportal"){ window.location.assign("/hrportal/"); return; } setNav(k); }}
        collapsed={collapsed}
        onToggleCollapsed={(next)=>{ setCollapsed(next); try{ localStorage.setItem(LS_SIDEBAR, next ? "1":"0"); }catch{} }}
      />

      {/* Main */}
      <main className="min-w-0 flex flex-col">
        <HeaderBar
          nav={nav}
          setShowMobileNav={setShowMobileNav}
          query={state.query}
          setQuery={actions.setQuery}
          IconMenu={IconMenu}
          IconSearch={IconSearch}
        />

        <div className="p-6">
          {/* Errores/cargas */}
          {state.err && <div className="mb-3"><Alert tone="error">{state.err}</Alert></div>}
          {(state.loading || loadingCatsProvs) && <div className="mb-3"><Alert>Cargando…</Alert></div>}
          {errCatsProvs && <div className="mb-3"><Alert tone="error">{errCatsProvs}</Alert></div>}

          {/* Beneficios */}
          {nav === "beneficios" && (
            <>
              <FiltersBar
                selCat={state.selCat}
                selProv={state.selProv}
                setSelCat={actions.setSelCat}
                setSelProv={actions.setSelProv}
                visibleCats={state.visibleCats}
                visibleProvs={state.visibleProvs}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CardNew onClick={openNew} />
                {state.filtered.map((it, i) => (
                  <CardBeneficio
                    key={it.id || `b-${i}`}   // ← key robusta
                    item={it}
                    onEdit={() => openEdit(it)}
                    onDelete={async () => { await actions.remove(it.beneficioId || it.id); }}
                  />
                ))}
              </div>

              {state.filtered.length === 0 && (
                <div className="text-white/60 text-sm mt-2">Sin resultados.</div>
              )}
            </>
          )}

          {/* Categorías */}
          {nav === "categorias" && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">Categorías</h2>
                <div className="ml-auto" />
                <button onClick={addCategoria} className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-2 font-semibold">
                  + Nueva
                </button>
              </div>
              <SimpleList
                rows={cats.map(c => ({ ...c, titulo: c.titulo ?? c.nombre ?? c.Nombre }))}
                prop="titulo"
                onRename={renameCategoria}
                onDelete={deleteCategoria}
              />
            </section>
          )}

          {/* Proveedores */}
          {nav === "proveedores" && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">Proveedores</h2>
                <div className="ml-auto" />
                <button onClick={addProveedor} className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-2 font-semibold">
                  + Nuevo
                </button>
              </div>
              <SimpleList rows={provs} prop="nombre" onRename={renameProveedor} onDelete={deleteProveedor} />
            </section>
          )}
        </div>

        {/* Sidebar móvil */}
        <MobileSidebar
          open={showMobileNav}
          current={nav}
          items={mobileItems}
          onSelect={(key)=>{ if(key==="hrportal"){ setShowMobileNav(false); window.location.assign("/hrportal/"); return; } setNav(key); setShowMobileNav(false); }}
          onClose={()=>setShowMobileNav(false)}
        />

        {/* Modal del form */}
        {showForm && (
          <div
            className="fixed inset-0 z-[9999] grid"
            aria-modal="true"
            role="dialog"
            onKeyDown={(e)=>{ if(e.key==='Escape') setShowForm(false); }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={()=>setShowForm(false)} />

            {/* Panel */}
            <div className="relative z-10 m-4 sm:m-8 lg:m-16 place-self-center w-full max-w-2xl">
              <div className="max-h-[85vh] overflow-auto rounded-2xl border border-white/10 bg-neutral-900 p-4">
                <FullForm
                  initial={editing}
                  provs={provs || []}
                  cats={cats || []}
                  onCancel={()=>{ setShowForm(false); setEditing(null); }}
                  onCreateCat={async () => await addCategoria()}
                  onCreateProv={async () => await addProveedor()}
                  onSave={async (dto) => {
                    await actions.save(dto, editing);
                    setShowForm(false);
                    setEditing(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
