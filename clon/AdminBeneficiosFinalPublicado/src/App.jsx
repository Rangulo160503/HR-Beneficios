// src/components/AdminShell.jsx
import { useMemo, useState } from "react";

/* ====== Seeds (mock) ====== */
const CATS_SEED = [
  { id: "c1", titulo: "Cirugía" },
  { id: "c2", titulo: "Consulta" },
  { id: "c3", titulo: "Estética Dental" },
];
const PROVS_SEED = [
  { id: "p1", nombre: "CDACC" },
  { id: "p2", nombre: "Dra. Adriana Mena" },
  { id: "p3", nombre: "Clínica Sonrisas" },
];
const INIT_BENS = [
  { id:"b1", titulo:"Extracción Simple", proveedorId:"p2", proveedorNombre:"Dra. Adriana Mena",
    categoriaId:"c1", categoriaNombre:"Cirugía", precio:35000, moneda:"CRC", disponible:true, imagenUrl:"" },
  { id:"b2", titulo:"Férula de Bruxismo", proveedorId:"p2", proveedorNombre:"Dra. Adriana Mena",
    categoriaId:"c3", categoriaNombre:"Estética Dental", precio:90000, moneda:"CRC", disponible:true, imagenUrl:"" },
];

/* ====== Helpers ====== */
const money = (v) => (v == null ? "" : v.toLocaleString("es-CR"));
const cls = (...a) => a.filter(Boolean).join(" ");

export default function AdminShell() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [nav, setNav] = useState("beneficios");
  const [query, setQuery] = useState("");

  const [cats, setCats] = useState(CATS_SEED);
  const [provs, setProvs] = useState(PROVS_SEED);
  const [items, setItems] = useState(INIT_BENS);

  const [selCat, setSelCat] = useState("");
  const [selProv, setSelProv] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // NUEVO: sheets de administración desde chips
  const [showCatsMgr, setShowCatsMgr] = useState(false);
  const [showProvsMgr, setShowProvsMgr] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(b => {
      const byCat = !selCat || b.categoriaId === selCat;
      const byProv = !selProv || b.proveedorId === selProv;
      const byQ = !q || [b.titulo, b.proveedorNombre, b.categoriaNombre].join(" ").toLowerCase().includes(q);
      return byCat && byProv && byQ;
    });
  }, [items, selCat, selProv, query]);

  function openNew() { setEditing(null); setShowForm(true); }
  function openEdit(it) { setEditing(it); setShowForm(true); }
  function remove(id) { setItems(s => s.filter(x => x.id !== id)); }

  return (
    /* === CONTENEDOR: móvil 1 columna, desktop sidebar + main === */
    <div className="min-h-screen bg-neutral-950 text-white md:grid md:grid-cols-[260px_1fr]">

      {/* Sidebar (oculto en móvil) */}
      <aside className="bg-neutral-950 border-r border-white/10 hidden md:flex flex-col">
        <div className="h-14 md:h-16 flex items-center px-4 border-b border-white/10">
          <div className="font-semibold">{collapsed ? "HR" : "HR Beneficios"}</div>
          <button
            className="ml-auto text-white/60 hover:text-white"
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>
        <nav className="p-2 flex-1 space-y-1">
          <NavItem label="Beneficios" active={nav==="beneficios"} collapsed={collapsed} onClick={()=>setNav("beneficios")} />
        </nav>
        <div className="p-3 text-xs text-white/50 border-t border-white/10">
          {collapsed ? "v1" : "Versión 1.0.0"}
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex flex-col">
        {/* Topbar sticky */}
        <div className="h-14 md:h-16 flex items-center gap-2 md:gap-3 px-3 md:px-6 border-b border-white/10 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
          <button
            className="md:hidden rounded-lg border border-white/20 px-3 py-1.5"
            onClick={() => setShowMobileNav(true)}
            aria-label="Abrir menú"
          >
            Menú
          </button>

          <h1 className="font-semibold capitalize hidden sm:block">{nav}</h1>

          {nav === "beneficios" && (
            <input
              placeholder="Buscar beneficios"
              className="ml-auto w-[55%] sm:w-64 md:w-80 rounded-lg bg-neutral-900 border border-white/10 px-3 py-1.5 md:py-2
                         text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
            />
          )}

          <div className="hidden sm:flex items-center gap-2 ml-2">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-white/60">admin@empresa.com</div>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 border border-white/10 grid place-items-center">A</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto w-full space-y-6">

            {nav === "beneficios" && (
              <section className="space-y-4">
                {/* Chips: carrusel horizontal táctil en móvil */}
                <div className="flex flex-col gap-3">
                  {/* Categorías */}
                  <div className="flex gap-2 overflow-x-auto pb-1 snap-x -mx-1 px-1">
                    <Chip active={!selCat} onClick={()=>setSelCat("")} label="Todas las categorías" />
                    {cats.map(c => (
                      <Chip key={c.id} active={selCat===c.id} onClick={()=>setSelCat(c.id)} label={c.titulo}/>
                    ))}
                    {/* Chip CRUD Categorías */}
                    <ChipAdd label="+ Categoría" onClick={()=>setShowCatsMgr(true)} />
                  </div>

                  {/* Proveedores */}
                  <div className="flex gap-2 overflow-x-auto pb-1 snap-x -mx-1 px-1">
                    <Chip active={!selProv} onClick={()=>setSelProv("")} label="Todos los proveedores" />
                    {provs.map(p => (
                      <Chip key={p.id} active={selProv===p.id} onClick={()=>setSelProv(p.id)} label={p.nombre}/>
                    ))}
                    {/* Chip CRUD Proveedores */}
                    <ChipAdd label="+ Proveedor" onClick={()=>setShowProvsMgr(true)} />
                  </div>
                </div>

                {/* ÚNICO GRID: 1 col en móvil, 2 en sm, 3 en xl */}
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  <CardNew onClick={openNew} />
                  {filtered.map(b => (
                    <CardBeneficio key={b.id} item={b} onEdit={()=>openEdit(b)} onDelete={()=>remove(b.id)} />
                  ))}
                </div>

                {filtered.length === 0 && <div className="text-white/60 text-sm">Sin resultados.</div>}
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Menú lateral móvil */}
      <MobileSidebar
        open={showMobileNav}
        current={nav}
        onSelect={(key) => { setNav(key); setShowMobileNav(false); }}
        onClose={() => setShowMobileNav(false)}
      />

      {/* Sheet del formulario de Beneficios */}
      {showForm && (
        <FullForm
          initial={editing}
          cats={cats}
          provs={provs}
          onCancel={()=>setShowForm(false)}
          onCreateCat={(titulo) => {
            const nodo = { id: "c" + Math.random().toString(36).slice(2,7), titulo };
            setCats(s => [nodo, ...s]); return nodo;
          }}
          onCreateProv={(nombre) => {
            const nodo = { id: "p" + Math.random().toString(36).slice(2,7), nombre };
            setProvs(s => [nodo, ...s]); return nodo;
          }}
          onSave={(dto) => {
            if (editing) {
              setItems(list => list.map(x => x.id===editing.id ? {
                ...x, ...dto,
                proveedorNombre: (provs.find(p => p.id === dto.proveedorId)?.nombre) ?? "",
                categoriaNombre: (cats.find(c => c.id === dto.categoriaId)?.titulo) ?? "",
              } : x));
            } else {
              const nuevo = {
                ...dto,
                id: "b" + Math.random().toString(36).slice(2,7),
                proveedorNombre: (provs.find(p => p.id === dto.proveedorId)?.nombre) ?? "",
                categoriaNombre: (cats.find(c => c.id === dto.categoriaId)?.titulo) ?? "",
              };
              setItems(s => [nuevo, ...s]);
            }
            setShowForm(false);
          }}
        />
      )}

      {/* Sheets de administración desde chips */}
      {showCatsMgr && (
        <ManageListSheet
          title="Categorías"
          rows={cats}
          prop="titulo"
          onClose={()=>setShowCatsMgr(false)}
          onAdd={(v)=> setCats(s => [{ id: "c"+rand5(), titulo: v }, ...s])}
          onRename={(r,v)=> setCats(s => s.map(x => x.id===r.id ? { ...x, titulo: v } : x))}
          onDelete={(r)=> {
            setCats(s => s.filter(x => x.id !== r.id));
            // además, limpia selección si toca
            setSelCat(sc => sc === r.id ? "" : sc);
          }}
        />
      )}
      {showProvsMgr && (
        <ManageListSheet
          title="Proveedores"
          rows={provs}
          prop="nombre"
          onClose={()=>setShowProvsMgr(false)}
          onAdd={(v)=> setProvs(s => [{ id: "p"+rand5(), nombre: v }, ...s])}
          onRename={(r,v)=> setProvs(s => s.map(x => x.id===r.id ? { ...x, nombre: v } : x))}
          onDelete={(r)=> {
            setProvs(s => s.filter(x => x.id !== r.id));
            setSelProv(sp => sp === r.id ? "" : sp);
          }}
        />
      )}
    </div>
  );
}

/* ====== UI bits ====== */
function NavItem({ label, icon, active, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
        active ? "bg-neutral-800 text-white" : "hover:bg-white/10 text-white/90"
      )}
      title={collapsed ? label : undefined}
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}

function Chip({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "px-4 py-1.5 rounded-full text-sm whitespace-nowrap snap-start",
        active ? "bg-neutral-700 text-white" : "bg-neutral-900 border border-white/10 hover:bg-neutral-800"
      )}
    >
      {label}
    </button>
  );
}

// Chip para abrir CRUD (estilo “añadir”)
function ChipAdd({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap snap-start
                 bg-neutral-900 border border-dashed border-white/20 hover:bg-neutral-800/70 text-white/90"
      title={label}
    >
      {label}
    </button>
  );
}

function HeaderRow({ title, onAdd }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="ml-auto" />
      <button
        onClick={onAdd}
        className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white font-semibold px-3 py-2"
      >
        + Nuevo
      </button>
    </div>
  );
}

function CardBeneficio({ item, onEdit, onDelete }) {
  const img = item.imagenUrl;
  return (
    <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
      <div className="relative">
        <div className="absolute left-3 top-3 z-10">
          <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
            {item.categoriaNombre}
          </span>
        </div>
        <div className="aspect-video bg-neutral-800 grid place-items-center text-white/50">
          {img ? <img className="w-full h-full object-cover" src={img} alt={item.titulo} /> : <div>Sin imagen</div>}
        </div>
      </div>
      <div className="p-3">
        <div className="text-sm text-white/70">{item.proveedorNombre}</div>
        <div className="text-lg font-semibold">{item.titulo}</div>
        <div className="text-sm text-white/60">{item.moneda} {money(item.precio)}</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={onEdit}
            className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-sm font-medium">
            Editar
          </button>
          <button onClick={onDelete}
            className="px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-sm">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

function SimpleList({ rows, prop, onRename, onDelete }) {
  return (
    <div className="rounded-2xl bg-neutral-900 border border-white/10 divide-y divide-white/10">
      {rows.map(r => (
        <div key={r.id} className="px-3 py-3 flex items-center gap-3">
          <div className="flex-1">{r[prop]}</div>
          <button
            onClick={()=>onRename(r)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white text-sm font-medium">
            Renombrar
          </button>
          <button
            onClick={()=>onDelete(r)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-sm">
            Eliminar
          </button>
        </div>
      ))}
      {rows.length===0 && <div className="px-3 py-3 text-white/60 text-sm">Sin elementos.</div>}
    </div>
  );
}

function CardNew({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden text-left group focus:outline-none focus:ring-2 focus:ring-white/20"
    >
      <div className="relative">
        <div className="absolute left-3 top-3 z-10">
          <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
            Nuevo
          </span>
        </div>
        <div className="aspect-video bg-neutral-800 grid place-items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border border-dashed border-white/30 grid place-items-center text-white/70">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="mt-2 text-xs text-white/50">Agregar imagen (opcional)</div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="text-sm text-white/70">Crear</div>
        <div className="text-lg font-semibold">Agregar nuevo beneficio</div>
        <div className="text-sm text-transparent select-none">₡ 0</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="px-3 py-2 rounded-lg bg-neutral-800 group-hover:bg-neutral-700 border border-white/10 text-sm font-medium transition">
            Crear
          </span>
          <span className="px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-sm text-white/80">
            Opciones
          </span>
        </div>
      </div>
    </button>
  );
}

/* ====== Form overlay (beneficios) ====== */
function FullForm({ initial, cats, provs, onCreateCat, onCreateProv, onCancel, onSave }) {
  const [form, setForm] = useState(initial || {
    titulo:"", precio:"", moneda:"CRC", proveedorId:"", categoriaId:"",
    descripcion:"", condiciones:"", vigenciaInicio:"", vigenciaFin:"", disponible:true, imagenUrl:""
  });
  const [preview, setPreview] = useState(initial?.imagenUrl || "");

  function quickAdd(type) {
    const val = prompt(type==='prov' ? 'Nuevo proveedor' : 'Nueva categoría'); if(!val) return;
    if (type==='prov') { const n=onCreateProv(val); setForm(s=>({...s, proveedorId:n.id})); }
    else { const n=onCreateCat(val); setForm(s=>({...s, categoriaId:n.id})); }
  }
  function submit(e){ e.preventDefault(); onSave(form); }
  function handleFile(e){
    const f=e.target.files?.[0]; if(!f) return;
    const url=URL.createObjectURL(f); setPreview(url); setForm(s=>({...s, imagenUrl:url}));
  }

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur">
      {/* móvil: ancho completo; desktop: panel derecho */}
      <div className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-[520px] bg-neutral-950 border-l border-white/10 overflow-auto">
        <form onSubmit={submit} className="p-4 pb-28 space-y-4">
          <div className="sticky top-0 -mx-4 px-4 py-3 bg-neutral-950/80 backdrop-blur border-b border-white/10 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-3 py-1.5">
              Cerrar
            </button>
            <div className="text-lg font-semibold flex-1">{initial ? "Editar beneficio" : "Nuevo beneficio"}</div>
            <button
              className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white font-semibold px-4 py-2 text-sm md:text-base">
              Guardar
            </button>
          </div>

          <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 space-y-3">
            <h3 className="font-semibold">Datos principales</h3>
            <div className="space-y-2">
              <label className="text-sm">Título</label>
              <input className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                value={form.titulo} onChange={e=>setForm(s=>({...s, titulo:e.target.value}))} required />
            </div>

            <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
              <div className="space-y-2">
                <label className="text-sm">Precio</label>
                <input type="number" inputMode="decimal" min="0" step="1"
                  className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                  value={form.precio} onChange={e=>setForm(s=>({...s, precio:e.target.value}))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Moneda</label>
                <select className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                  value={form.moneda} onChange={e=>setForm(s=>({...s, moneda:e.target.value}))}>
                  <option>CRC</option><option>USD</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Proveedor</label>
                  <button type="button" onClick={()=>quickAdd('prov')}
                    className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white">+ nuevo</button>
                </div>
                <select className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                  value={form.proveedorId} onChange={e=>setForm(s=>({...s, proveedorId:e.target.value}))} required>
                  <option value="">-- Seleccione --</option>
                  {provs.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Categoría</label>
                  <button type="button" onClick={()=>quickAdd('cat')}
                    className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white">+ nueva</button>
                </div>
                <select className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                  value={form.categoriaId} onChange={e=>setForm(s=>({...s, categoriaId:e.target.value}))} required>
                  <option value="">-- Seleccione --</option>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 space-y-3">
            <h3 className="font-semibold">Imagen</h3>
            <input type="file" accept="image/*" capture="environment" onChange={handleFile} />
            <div className="mt-2 aspect-video bg-neutral-800 rounded-xl grid place-items-center overflow-hidden">
              {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <div className="text-white/50 text-sm">Sin imagen</div>}
            </div>
          </section>

          <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 space-y-3">
            <h3 className="font-semibold">Descripción y condiciones</h3>
            <div className="space-y-2">
              <label className="text-sm">Descripción</label>
              <textarea className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                rows={4} value={form.descripcion} onChange={e=>setForm(s=>({...s, descripcion:e.target.value}))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Condiciones</label>
              <textarea className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                rows={3} value={form.condiciones} onChange={e=>setForm(s=>({...s, condiciones:e.target.value}))} />
            </div>

            <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
              <div className="space-y-2">
                <label className="text-sm">Vigencia inicio</label>
                <input type="date" className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                  value={form.vigenciaInicio} onChange={e=>setForm(s=>({...s, vigenciaInicio:e.target.value}))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Vigencia fin</label>
                <input type="date" className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                  value={form.vigenciaFin} onChange={e=>setForm(s=>({...s, vigenciaFin:e.target.value}))} />
              </div>
            </div>

            <label className="flex items-center gap-2 select-none">
              <input type="checkbox" checked={form.disponible}
                onChange={e=>setForm(s=>({...s, disponible:e.target.checked}))}/>
              Disponible
            </label>
          </section>
        </form>
      </div>
    </div>
  );
}

/* ====== Sheet reutilizable para CRUD de listas (categorías / proveedores) ====== */
function ManageListSheet({ title, rows, prop, onAdd, onRename, onDelete, onClose }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onAdd(v);
    setValue("");
  }

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur">
      <div className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-[520px] bg-neutral-950 border-l border-white/10 overflow-auto">
        <div className="sticky top-0 -mx-4 px-4 py-3 bg-neutral-950/80 backdrop-blur border-b border-white/10 flex items-center gap-3">
          <button onClick={onClose} className="rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-3 py-1.5">Cerrar</button>
          <div className="text-lg font-semibold flex-1">{title}</div>
        </div>

        <div className="p-4 space-y-4">
          <form onSubmit={submit} className="flex gap-2">
            <input
              className="flex-1 rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-white placeholder-white/60"
              placeholder={`Nueva/o ${title.slice(0,-1).toLowerCase()}`}
              value={value}
              onChange={e=>setValue(e.target.value)}
            />
            <button className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-4">Agregar</button>
          </form>

          <div className="rounded-2xl bg-neutral-900 border border-white/10 divide-y divide-white/10">
            {rows.map(r => (
              <RowEditable
                key={r.id}
                value={r[prop]}
                onRename={(v)=>onRename(r,v)}
                onDelete={()=>onDelete(r)}
              />
            ))}
            {rows.length===0 && <div className="px-3 py-3 text-white/60 text-sm">Sin elementos.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function RowEditable({ value, onRename, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [txt, setTxt] = useState(value);

  function save() {
    const v = txt.trim();
    if (!v) return;
    onRename(v);
    setEdit(false);
  }

  return (
    <div className="px-3 py-3 flex items-center gap-3">
      {!edit ? (
        <>
          <div className="flex-1">{value}</div>
          <button onClick={()=>{ setTxt(value); setEdit(true); }}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white text-sm font-medium">
            Renombrar
          </button>
          <button onClick={onDelete}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-sm">
            Eliminar
          </button>
        </>
      ) : (
        <>
          <input
            className="flex-1 rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-white"
            value={txt}
            onChange={e=>setTxt(e.target.value)}
          />
            <button onClick={save}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white text-sm font-medium">
              Guardar
            </button>
            <button onClick={()=>setEdit(false)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-sm">
              Cancelar
            </button>
        </>
      )}
    </div>
  );
}

/* ====== Mobile Sidebar ====== */
function MobileSidebar({ open, current, onSelect, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[82%] max-w-xs bg-neutral-950 border-r border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="font-semibold text-lg">HR Beneficios</div>
          <button className="ml-auto rounded-lg border border-white/10 px-3 py-1.5" onClick={onClose}>Cerrar</button>
        </div>
        <nav className="space-y-1">
          {[{ key: "beneficios", label: "Beneficios" }].map((i) => (
            <button
              key={i.key}
              onClick={() => onSelect(i.key)}
              className={cls(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl",
                current === i.key ? "bg-neutral-800 text-white" : "bg-neutral-900 border border-white/10 hover:bg-neutral-800/70"
              )}
            >
              <span>{i.icon}</span>
              <span className="font-medium">{i.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ====== Utils ====== */
function rand5(){ return Math.random().toString(36).slice(2,7); }
