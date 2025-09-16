// src/components/AdminShell.jsx
import { useEffect, useMemo, useState } from "react";
import { BeneficioApi, CategoriaApi, ProveedorApi } from "./services/adminApi";

/* ====== Helpers ====== */
const money = (v) => (v == null ? "" : Number(v).toLocaleString("es-CR"));
const cls = (...a) => a.filter(Boolean).join(" ");
const normId = (v) => (v == null ? "" : String(v).trim());
const lower  = (v) => normId(v).toLowerCase();

// --- Selección resiliente (si no hay id, usamos name:<etiqueta>)
const mkSel     = (id, label) => normId(id) || `name:${String(label ?? "").trim()}`;
const isNameSel = (sel) => String(sel).startsWith("name:");
const nameOfSel = (sel) => String(sel).slice(5);

// --- Keys estables para listas
const slug = (s) => String(s ?? "").toLowerCase().trim()
  .replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "").slice(0, 40);
const keyOf = (prefix, id, label, idx) => {
  const a = normId(id); if (a) return `${prefix}-${a}`;
  const b = slug(label); if (b) return `${prefix}-${b}`;
  return `${prefix}-${idx}`;
};

export default function AdminShell() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [nav, setNav] = useState("beneficios");
  const [query, setQuery] = useState("");

  // datos desde backend
  const [cats, setCats] = useState([]);
  const [provs, setProvs] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selCat, setSelCat] = useState("");
  const [selProv, setSelProv] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  // ============== CARGA INICIAL ==============
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [Craw, Praw, Braw] = await Promise.all([
          CategoriaApi.list(),
          ProveedorApi.list(),
          BeneficioApi.list(),
        ]);
        if (!alive) return;

        // 🔧 Normalizo IDs y nombres (cubre alias comunes)
        const C = (Craw ?? []).map(c => ({
          ...c,
          id: normId(c.id ?? c.categoriaId ?? c.Id ?? c.CategoriaId ?? c.CategoriaID),
          titulo: c.titulo ?? c.nombre ?? c.Titulo ?? c.Nombre ?? "",
        }));
        const P = (Praw ?? []).map(p => ({
          ...p,
          id: normId(p.id ?? p.proveedorId ?? p.Id ?? p.ProveedorId ?? p.ProveedorID),
          nombre: p.nombre ?? p.Nombre ?? "",
        }));
        const B = (Braw ?? []).map(b => {
          const categoriaId = normId(
            b.categoriaId ?? b.categoriaID ?? b.CategoriaId ?? b.CategoriaID ??
            b.categoria?.id ?? b.categoria?.Id ?? b.categoria ?? b.categoryId
          );
          const proveedorId = normId(
            b.proveedorId ?? b.proveedorID ?? b.ProveedorId ?? b.ProveedorID ??
            b.proveedor?.id ?? b.proveedor?.Id ?? b.proveedor ?? b.providerId
          );
          return {
            ...b,
            id: normId(b.id ?? b.Id ?? slug(b.titulo ?? "")),
            categoriaId,
            proveedorId,
            categoriaNombre: b.categoriaNombre ?? b.categoria?.titulo ?? b.categoria?.nombre ?? b.categoria ?? "",
            proveedorNombre: b.proveedorNombre ?? b.proveedor?.nombre ?? b.proveedor ?? "",
          };
        });

        setCats(C);
        setProvs(P);
        setItems(B);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los datos. Revisa el API_BASE o CORS.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // ============== FILTRO ROBUSTO (id o nombre) ==============
  const filtered = useMemo(() => {
    const q = lower(query);

    return items.filter((b) => {
      const bCatId    = lower(b.categoriaId);
      const bProvId   = lower(b.proveedorId);
      const bCatName  = lower(b.categoriaNombre);
      const bProvName = lower(b.proveedorNombre);

      // --- Categoría ---
      let byCat = true;
      if (selCat) {
        if (isNameSel(selCat)) {
          const wanted = lower(nameOfSel(selCat));
          byCat = !!wanted && bCatName === wanted;
        } else {
          const wanted = lower(selCat);
          byCat = !!wanted && bCatId === wanted;
        }
      }

      // --- Proveedor ---
      let byProv = true;
      if (selProv) {
        if (isNameSel(selProv)) {
          const wanted = lower(nameOfSel(selProv));
          byProv = !!wanted && bProvName === wanted;
        } else {
          const wanted = lower(selProv);
          byProv = !!wanted && bProvId === wanted;
        }
      }

      // --- Texto ---
      const hayTexto = [b.titulo, b.proveedorNombre, b.categoriaNombre]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const byQ = !q || hayTexto.includes(q);
      return byCat && byProv && byQ;
    });
  }, [items, selCat, selProv, query]);

  function openNew() { setEditing(null); setShowForm(true); }
  function openEdit(it) { setEditing(it); setShowForm(true); }

  // ============== CRUD: Beneficio ==============
  async function saveBeneficio(dto) {
    try {
      setError("");
      if (editing) {
        const updated = await BeneficioApi.update(editing.id, dto);
        const norm = {
          ...updated,
          id: normId(updated.id ?? updated.Id ?? editing.id),
          categoriaId: normId(updated.categoriaId),
          proveedorId: normId(updated.proveedorId),
        };
        setItems(list => list.map(x => (x.id === editing.id ? norm : x)));
      } else {
        const created = await BeneficioApi.create(dto);
        const norm = {
          ...created,
          id: normId(created.id ?? created.Id),
          categoriaId: normId(created.categoriaId),
          proveedorId: normId(created.proveedorId),
        };
        setItems(s => [norm, ...s]);
      }
      setShowForm(false);
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar el beneficio.");
    }
  }

  async function remove(id) {
    if (!confirm("¿Eliminar este beneficio?")) return;
    try {
      setError("");
      await BeneficioApi.remove(id);
      setItems(s => s.filter(x => x.id !== id));
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar el beneficio.");
    }
  }

  // ============== CRUD: Categoría / Proveedor ==============
  async function addCategoria(titulo) {
    const created = await CategoriaApi.create({ titulo });
    const nodo = { ...created, id: normId(created.id ?? created.categoriaId ?? created.Id) };
    setCats(s => [nodo, ...s]);
    return nodo;
  }
  async function addProveedor(nombre) {
    const created = await ProveedorApi.create({ nombre });
    const nodo = { ...created, id: normId(created.id ?? created.proveedorId ?? created.Id) };
    setProvs(s => [nodo, ...s]);
    return nodo;
  }

  async function renameCategoria(r, nuevoTitulo) {
    const updated = await CategoriaApi.update(r.id, { ...r, titulo: nuevoTitulo });
    const nodo = { ...updated, id: normId(updated.id ?? updated.categoriaId ?? r.id) };
    setCats(s => s.map(x => x.id === r.id ? nodo : x));
  }
  async function renameProveedor(r, nuevoNombre) {
    const updated = await ProveedorApi.update(r.id, { ...r, nombre: nuevoNombre });
    const nodo = { ...updated, id: normId(updated.id ?? updated.proveedorId ?? r.id) };
    setProvs(s => s.map(x => x.id === r.id ? nodo : x));
  }

  async function deleteCategoria(r) {
    if (!confirm("¿Eliminar categoría?")) return;
    await CategoriaApi.remove(r.id);
    setCats(s => s.filter(x => x.id !== r.id));
  }
  async function deleteProveedor(r) {
    if (!confirm("¿Eliminar proveedor?")) return;
    await ProveedorApi.remove(r.id);
    setProvs(s => s.filter(x => x.id !== r.id));
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white md:grid md:grid-cols-[260px_1fr]">
      {/* Sidebar */}
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
          <NavItem label="Beneficios"  active={nav==="beneficios"}  collapsed={collapsed} onClick={()=>setNav("beneficios")} />
          <NavItem label="Categorías"  active={nav==="categorias"}  collapsed={collapsed} onClick={()=>setNav("categorias")} />
          <NavItem label="Proveedores" active={nav==="proveedores"} collapsed={collapsed} onClick={()=>setNav("proveedores")} />
        </nav>
        <div className="p-3 text-xs text-white/50 border-t border-white/10">
          {collapsed ? "v1" : "Versión 1.0.0"}
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="h-14 md:h-16 flex items-center gap-2 md:gap-3 px-3 md:px-6 border-b border-white/10 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
          <button className="md:hidden rounded-lg border border-white/20 px-3 py-1.5" onClick={() => setShowMobileNav(true)} aria-label="Abrir menú">
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
            {error && <div className="text-red-400 text-sm">{error}</div>}
            {loading && <div className="text-white/60 text-sm">Cargando…</div>}

            {nav === "beneficios" && (
              <section className="space-y-4">
                {/* Chips */}
                <div className="flex flex-col gap-3">
                  {/* Categorías */}
                  <div className="flex gap-2 overflow-x-auto pb-1 snap-x -mx-1 px-1">
                    <Chip active={!selCat} onClick={()=>setSelCat("")} label="Todas las categorías" />
                    {cats.map((c, i) => {
                      const id    = normId(c.id ?? c.categoriaId);
                      const label = c.titulo ?? c.nombre ?? "—";
                      const val   = mkSel(id, label);

                      const activeById   = selCat && !isNameSel(selCat) && lower(selCat) === lower(id);
                      const activeByName = selCat && isNameSel(selCat)   && lower(nameOfSel(selCat)) === lower(label);
                      const isActive = activeById || activeByName;

                      return (
                        <Chip
                          key={keyOf("cat", id || val, label, i)}
                          active={isActive}
                          onClick={() => setSelCat(isActive ? "" : val)}
                          label={label}
                        />
                      );
                    })}
                  </div>
                  {/* Proveedores */}
                  <div className="flex gap-2 overflow-x-auto pb-1 snap-x -mx-1 px-1">
                    <Chip active={!selProv} onClick={()=>setSelProv("")} label="Todos los proveedores" />
                    {provs.map((p, i) => {
                      const id    = normId(p.id ?? p.proveedorId);
                      const label = p.nombre ?? "—";
                      const val   = mkSel(id, label);

                      const activeById   = selProv && !isNameSel(selProv) && lower(selProv) === lower(id);
                      const activeByName = selProv && isNameSel(selProv)   && lower(nameOfSel(selProv)) === lower(label);
                      const isActive = activeById || activeByName;

                      return (
                        <Chip
                          key={keyOf("prov", id || val, label, i)}
                          active={isActive}
                          onClick={() => setSelProv(isActive ? "" : val)}
                          label={label}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Grid */}
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  <CardNew onClick={openNew} />
                  {filtered.map((b, i) => (
                    <CardBeneficio
                      key={keyOf("b", b.id, b.titulo ?? b.proveedorNombre ?? "b", i)}
                      item={b}
                      onEdit={()=>openEdit(b)}
                      onDelete={()=>remove(b.id)}
                    />
                  ))}
                </div>

                {filtered.length === 0 && <div className="text-white/60 text-sm">Sin resultados.</div>}
              </section>
            )}

            {nav === "proveedores" && (
              <section className="space-y-4">
                <HeaderRow title="Proveedores" onAdd={async ()=>{
                  const v = prompt("Nuevo proveedor"); if (!v) return;
                  try { await addProveedor(v); } catch(e){ alert("No se pudo crear"); }
                }} />
                <SimpleList
                  rows={provs} prop="nombre"
                  onRename={async (r)=>{ const v=prompt("Renombrar proveedor", r.nombre); if(!v) return; try { await renameProveedor(r, v); } catch { alert("No se pudo renombrar"); } }}
                  onDelete={async (r)=>{ try { await deleteProveedor(r); } catch { alert("No se pudo eliminar"); } }}
                />
              </section>
            )}

            {nav === "categorias" && (
              <section className="space-y-4">
                <HeaderRow title="Categorías" onAdd={async ()=>{
                  const v = prompt("Nueva categoría"); if (!v) return;
                  try { await addCategoria(v); } catch(e){ alert("No se pudo crear"); }
                }} />
                <SimpleList
                  rows={cats} prop="titulo"
                  onRename={async (r)=>{ const v=prompt("Renombrar categoría", r.titulo); if(!v) return; try { await renameCategoria(r, v); } catch { alert("No se pudo renombrar"); } }}
                  onDelete={async (r)=>{ try { await deleteCategoria(r); } catch { alert("No se pudo eliminar"); } }}
                />
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

      {/* Sheet del formulario */}
      {showForm && (
        <FullForm
          initial={editing}
          cats={cats}
          provs={provs}
          onCancel={()=>setShowForm(false)}
          onCreateCat={async (titulo) => await addCategoria(titulo)}
          onCreateProv={async (nombre) => await addProveedor(nombre)}
          onSave={saveBeneficio}
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
        <div className="text-sm text-white/60">₡ {money(item.precio)}</div>
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
      {rows.map((r, i) => (
        <div key={keyOf("row", r.id, r[prop], i)} className="px-3 py-3 flex items-center gap-3">
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

/* ====== Form overlay ====== */
function FullForm({ initial, cats, provs, onCreateCat, onCreateProv, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({
    titulo: initial?.titulo ?? "",
    precio: initial?.precio ?? "",
    proveedorId: initial?.proveedorId ? normId(initial.proveedorId) : "",
    categoriaId: initial?.categoriaId ? normId(initial.categoriaId) : "",
    descripcion: initial?.descripcion ?? "",
    condiciones: initial?.condiciones ?? "",
    vigenciaInicio: initial?.vigenciaInicio ?? "",
    vigenciaFin: initial?.vigenciaFin ?? "",
    imagenUrl: initial?.imagenUrl ?? "",
  }));
  const [preview, setPreview] = useState(initial?.imagenUrl ?? "");

  function quickAdd(type) {
    const val = prompt(type==='prov' ? 'Nuevo proveedor' : 'Nueva categoría'); if(!val) return;
    if (type==='prov') { onCreateProv(val).then(n => setForm(s=>({...s, proveedorId:normId(n.id)}))); }
    else { onCreateCat(val).then(n => setForm(s=>({...s, categoriaId:normId(n.id)}))); }
  }
  function submit(e){ e.preventDefault(); onSave(form); }
  function handleFile(e){
    const f=e.target.files?.[0]; if(!f) return;
    const url=URL.createObjectURL(f);
    setPreview(url);
    setForm(s=>({...s, imagenUrl:url}));
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
                <label className="text-sm">Precio (CRC)</label>
                <input type="number" inputMode="decimal" min="0" step="1"
                  className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2"
                  value={form.precio} onChange={e=>setForm(s=>({...s, precio:e.target.value}))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Moneda</label>
                <input disabled value="CRC" className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 opacity-60" />
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
                  value={form.proveedorId} onChange={e=>setForm(s=>({...s, proveedorId:normId(e.target.value)}))} required>
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
                  value={form.categoriaId} onChange={e=>setForm(s=>({...s, categoriaId:normId(e.target.value)}))} required>
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
          </section>
        </form>
      </div>
    </div>
  );
}

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
          {[
            { key: "beneficios", label: "Beneficios" },
            { key: "categorias", label: "Categorías" },
            { key: "proveedores", label: "Proveedores" },
          ].map((i) => (
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
