// src/components/AdminShell.jsx
import { useEffect, useState } from "react";
import HeaderBar from "./header/HeaderBar";
import MobileSidebar from "./sidebar/MobileSidebar";
import Sidebar from "./sidebar/Sidebar";
import CardNew from "./beneficio/CardNew";
import CardBeneficio from "./beneficio/CardBeneficio";
import FullForm from "./beneficio/FullForm";
import SimpleList from "./common/SimpleList";
import FiltersBar from "./beneficio/FiltersBar";
import { useBeneficios } from "../hooks/useBeneficios";
import { useCatalogos } from "../hooks/useCatalogos";
import CenterRefresh from "./common/CenterRefresh";

const IconMenu   =(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/></svg>);
const IconSearch =(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M20 20l-4.2-4.2" strokeWidth="2" strokeLinecap="round"/></svg>);
const IconGift   =(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="1.8"/><path d="M12 8v13M3 12h18" strokeWidth="1.8"/></svg>);
const IconTag    =(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><path d="M20 13.5 10.5 4H5v5.5L14.5 19a2.1 2.1 0 0 0 3 0L20 16.5a2.1 2.1 0 0 0 0-3z" strokeWidth="1.8"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>);
const IconBuilding=(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.8"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M4 19h16" strokeWidth="1.8"/></svg>);

const LS_SIDEBAR = "admin.sidebar.collapsed";

export default function AdminShell() {
  const { state, actions } = useBeneficios();
  const {
    cats, provs, loading: loadingCatsProvs, err: errCatsProvs,
    addCategoria, renameCategoria, deleteCategoria,
    addProveedor, renameProveedor, deleteProveedor
  } = useCatalogos();

  // Overlay activo si hay error o carga en cualquiera de los hooks
  const showOverlay = !!(state.err || errCatsProvs || state.loading || loadingCatsProvs);

  const [nav, setNav] = useState("beneficios");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Modal
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // ── NUEVO: estado para modal de categoría
const [catModalOpen, setCatModalOpen] = useState(false);
const [catForm, setCatForm] = useState({ id: null, nombre: "" });

const [provModalOpen, setProvModalOpen] = useState(false);
const [provForm, setProvForm] = useState({
  id: null,
  nombre: "",
  correo: "",
  telefono: "",
  direccion: "",
  imagen: "",
});

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

  // Abre modal para crear
// Abre modal para crear
function openNewCategoria() {
  setCatForm({ id: null, nombre: "" });
  setCatModalOpen(true);
}

// Abre modal para editar (acepta row o (id, nombre))
function openEditCategoria(arg1, arg2) {
  // Soporta distintas firmas de SimpleList:
  // 1) openEditCategoria(row)
  // 2) openEditCategoria(id, nombreActual)
  let id = null, nombre = "";

  if (typeof arg1 === "object" && arg1 !== null) {
    id = arg1.CategoriaId ?? arg1.id ?? arg1.Id ?? arg1.ID ?? null;
    nombre = arg1.titulo ?? arg1.nombre ?? arg1.Nombre ?? "";
  } else {
    id = arg1 ?? null;
    nombre = arg2 ?? "";
  }

  setCatForm({ id, nombre: String(nombre ?? "") });
  setCatModalOpen(true);
}

// Guardar (crea o renombra según haya id)
async function saveCategoria() {
  const name = catForm.nombre.trim();
  if (!name) return;

  if (catForm.id) {
    // editar existente
    await renameCategoria(catForm.id, name);
  } else {
    // crear nueva: si tu hook acepta nombre directo, usa addCategoria(name)
    // Si no, crea y luego renombra
    const created = await (addCategoria.length >= 1 ? addCategoria(name) : addCategoria());
    const newId =
      created?.CategoriaId ?? created?.id ?? created ?? null;
    if (newId && addCategoria.length < 1) {
      await renameCategoria(newId, name);
    }
  }

  setCatModalOpen(false);
  setCatForm({ id: null, nombre: "" });
}

// Abre modal para crear
function openNewProveedor() {
  setProvForm({ id: null, nombre: "", correo: "", telefono: "", direccion: "", imagen: "" });
  setProvModalOpen(true);
}

// Abre modal para editar (desde SimpleList)
function openEditProveedor(p) {
  setProvForm({
    id: p.ProveedorId ?? p.id ?? null,
    nombre: p.nombre ?? p.Nombre ?? "",
    correo: p.correo ?? p.Correo ?? "",
    telefono: p.telefono ?? p.Telefono ?? "",
    direccion: p.direccion ?? p.Direccion ?? "",
    imagen: p.imagen ?? p.Imagen ?? "",
  });
  setProvModalOpen(true);
}

// Guardar proveedor
async function saveProveedor() {
  const data = { ...provForm };
  if (!data.nombre.trim()) return;

  if (data.id) {
    // editar
    await renameProveedor(data.id, data.nombre); // aquí puedes ampliar si rename acepta más campos
  } else {
    // crear
    const created = await (addProveedor.length >= 1 ? addProveedor(data.nombre) : addProveedor());
    const newId =
      created?.ProveedorId ?? created?.id ?? created ?? null;
    if (newId && addProveedor.length < 1) {
      await renameProveedor(newId, data.nombre);
    }
  }

  setProvModalOpen(false);
  setProvForm({ id: null, nombre: "", correo: "", telefono: "", direccion: "", imagen: "" });
}
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
          {/* Beneficios */}
          {nav === "beneficios" && (
            <>
              {/* Chips fuera del blur */}
              <FiltersBar
                selCat={state.selCat}
                selProv={state.selProv}
                setSelCat={actions.setSelCat}
                setSelProv={actions.setSelProv}
                visibleCats={state.visibleCats}
                visibleProvs={state.visibleProvs}
              />

              {/* Sección blurrable */}
              <section className="relative mt-2" aria-busy={showOverlay}>
                {showOverlay && (
                  <div className="absolute inset-0 z-20 grid place-items-center bg-black/30 backdrop-blur-md pointer-events-auto">
                    <CenterRefresh
                      label={(state.loading || loadingCatsProvs) ? "Cargando…" : "Actualizar"}
                      onClick={(state.loading || loadingCatsProvs) ? undefined : () => window.location.reload()}
                    />
                  </div>
                )}

                <div className={showOverlay ? "pointer-events-none select-none" : ""}>
                  <div className="grid gap-4 md:gap-5 xl:gap-6 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                    <CardNew onClick={openNew} />
                    {state.filtered.map((it) => (
                      <CardBeneficio
                        key={it.id}
                        item={it}
                        onEdit={() => openEdit(it)}
                        onDelete={async () => { await actions.remove(it.id); }}
                      />
                    ))}
                  </div>

                  {state.filtered.length === 0 && (
                    <div className="text-white/60 text-sm mt-2">Sin resultados.</div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* Categorías */}
{nav === "categorias" && (
  <section className="space-y-4">
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-semibold">Categorías</h2>
      <div className="ml-auto" />
      <button
        onClick={openNewCategoria}
        className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-2 font-semibold"
      >
        + Nueva
      </button>
    </div>

    <SimpleList
      rows={(cats ?? []).map(c => ({
        ...c,
        // forzamos string seguro para evitar [object Object]
        titulo:
          (typeof c.titulo === "string" && c.titulo) ||
          (typeof c.nombre === "string" && c.nombre) ||
          (typeof c.Nombre === "string" && c.Nombre) ||
          String(c.titulo ?? c.nombre ?? c.Nombre ?? "")
      }))}
      prop="titulo"
      onRename={openEditCategoria}      // 👈 ahora abre modal de edición
      onDelete={deleteCategoria}
      // si SimpleList admite cambiar el texto del botón:
      // renameLabel="Editar"
    />
  </section>
)}


          {/* Proveedores */}
{nav === "proveedores" && (
  <section className="space-y-4">
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-semibold">Proveedores</h2>
      <div className="ml-auto" />
      <button
        onClick={openNewProveedor}
        className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-2 font-semibold"
      >
        + Nuevo
      </button>
    </div>

    <SimpleList
      rows={(provs ?? []).map(p => ({
        ...p,
        titulo:
          (typeof p.nombre === "string" && p.nombre) ||
          (typeof p.Nombre === "string" && p.Nombre) ||
          String(p.nombre ?? p.Nombre ?? "")
      }))}
      prop="titulo"
      onRename={openEditProveedor}   // 👈 abre modal
      onDelete={deleteProveedor}
      // renameLabel="Editar"
    />
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
        {catModalOpen && (
  <div className="fixed inset-0 z-[9998] grid">
    <div className="absolute inset-0 bg-black/60" onClick={()=>setCatModalOpen(false)} />
    <div className="relative z-10 place-self-center w-full max-w-md mx-4">
      <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
        <h3 className="text-lg font-semibold mb-3">
          {catForm.id ? "Editar categoría" : "Nueva categoría"}
        </h3>

        <label className="block text-sm mb-1 opacity-80">Nombre</label>
        <input
          value={catForm.nombre}
          onChange={(e)=>setCatForm(s => ({ ...s, nombre: e.target.value }))}
          autoFocus
          placeholder="Ej. Estética Dental"
          className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 outline-none focus:border-white/20"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={()=>setCatModalOpen(false)}
            className="rounded-lg border border-white/10 px-3 py-2 bg-white/5 hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            onClick={saveCategoria}
            className="rounded-lg bg-white text-black px-3 py-2 font-semibold hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{provModalOpen && (
  <div className="fixed inset-0 z-[9998] grid">
    <div className="absolute inset-0 bg-black/60" onClick={()=>setProvModalOpen(false)} />
    <div className="relative z-10 place-self-center w-full max-w-lg mx-4">
      <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
        <h3 className="text-lg font-semibold mb-3">
          {provForm.id ? "Editar proveedor" : "Nuevo proveedor"}
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1 opacity-80">Nombre</label>
            <input
              value={provForm.nombre}
              onChange={(e)=>setProvForm(s => ({ ...s, nombre: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 outline-none focus:border-white/20"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 opacity-80">Correo</label>
            <input
              value={provForm.correo}
              onChange={(e)=>setProvForm(s => ({ ...s, correo: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 outline-none focus:border-white/20"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 opacity-80">Teléfono</label>
            <input
              value={provForm.telefono}
              onChange={(e)=>setProvForm(s => ({ ...s, telefono: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 outline-none focus:border-white/20"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 opacity-80">Dirección</label>
            <input
              value={provForm.direccion}
              onChange={(e)=>setProvForm(s => ({ ...s, direccion: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 outline-none focus:border-white/20"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={()=>setProvModalOpen(false)}
            className="rounded-lg border border-white/10 px-3 py-2 bg-white/5 hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            onClick={saveProveedor}
            className="rounded-lg bg-white text-black px-3 py-2 font-semibold hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      </main>
    </div>
  );
}
