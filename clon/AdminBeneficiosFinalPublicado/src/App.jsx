// src/components/AdminShell.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { BeneficioApi, CategoriaApi, ProveedorApi } from "./services/adminApi";

/* ====== Helpers ====== */
const money = (v) => (v == null ? "" : Number(v).toLocaleString("es-CR"));
const cls = (...a) => a.filter(Boolean).join(" ");
const normId = (v) => (v == null ? "" : String(v).trim());
const lower  = (v) => normId(v).toLowerCase();

// GUID checker (para evitar PUT con ids inválidos)
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isGuid = (s) => typeof s === "string" && GUID_RE.test(s);

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

/* ====== Persistencia sidebar ====== */
const LS_SIDEBAR = "admin.sidebar.collapsed";

/* ====== Imagen helper ====== */
const normalizeImage = (img) => {
  if (!img || typeof img !== "string") return "";
  const s = img.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("blob:")) return s;
  // ¿parece base64?
  const looksB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
  if (looksB64) return `data:image/jpeg;base64,${s.replace(/\s/g, "")}`;
  return s; // ruta relativa u otro esquema
};

/* ====== Íconos (SVGs, sin emojis) ====== */
const IconGift = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="1.8"/>
    <path d="M12 8v13M3 12h18" strokeWidth="1.8"/>
    <path d="M7.5 6a2.5 2.5 0 1 1 5 0v2H9a1.5 1.5 0 0 1-1.5-1.5zM16.5 6A2.5 2.5 0 0 0 12 6v2h3a1.5 1.5 0 0 0 1.5-1.5z" strokeWidth="1.8"/>
  </svg>
);
const IconTag = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M20 13.5 10.5 4H5v5.5L14.5 19a2.1 2.1 0 0 0 3 0L20 16.5a2.1 2.1 0 0 0 0-3z" strokeWidth="1.8" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);
const IconBuilding = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.8"/>
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M4 19h16" strokeWidth="1.8"/>
  </svg>
);
const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="11" cy="11" r="7" strokeWidth="2"/>
    <path d="M20 20l-4.2-4.2" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconX = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M6 6l12 12M18 6L6 18" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconInfo = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="9" strokeWidth="1.8"/>
    <path d="M12 8h.01M11 11h2v5h-2z" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconError = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="9" strokeWidth="1.8"/>
    <path d="M8 8l8 8M16 8l-8 8" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export default function AdminShell() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [nav, setNav] = useState("beneficios");
  const [query, setQuery] = useState("");

  // buscador móvil (overlay)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // refs para submenú (scroll hacia chips)
  const catsRowRef = useRef(null);
  const provsRowRef = useRef(null);

  // datos
  const [cats, setCats] = useState([]);
  const [provs, setProvs] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selCat, setSelCat] = useState("");
  const [selProv, setSelProv] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  // ===== Persistir estado del sidebar =====
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_SIDEBAR);
      if (raw != null) setCollapsed(raw === "1");
    } catch {}
  }, []);
  const toggleCollapsedAndSave = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(LS_SIDEBAR, next ? "1" : "0"); } catch {}
      return next;
    });
  };

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

        // Categorías: API devuelve { categoriaId, nombre }
        const C = (Craw ?? []).map(c => ({
          ...c,
          id: normId(c.id ?? c.categoriaId ?? c.Id ?? c.CategoriaId),
          titulo: c.titulo ?? c.nombre ?? c.Nombre ?? "", // la UI usa 'titulo'
        }));

        // Proveedores: { proveedorId, nombre }
        const P = (Praw ?? []).map(p => ({
          ...p,
          id: normId(p.id ?? p.proveedorId ?? p.Id ?? p.ProveedorId),
          nombre: p.nombre ?? p.Nombre ?? "",
        }));

        // Beneficios: { beneficioId, titulo, precioCRC, imagen, proveedorNombre, categoriaNombre, ... }
        const B = (Braw ?? []).map(b => {
          const categoriaId = normId(
            b.categoriaId ?? b.CategoriaId ?? b.categoria?.id ?? b.categoria
          );
          const proveedorId = normId(
            b.proveedorId ?? b.ProveedorId ?? b.proveedor?.id ?? b.proveedor
          );
          const imagen = normalizeImage(b.imagen ?? b.imagenUrl ?? b.ImagenUrl ?? "");
          return {
            ...b,
            id: normId(b.id ?? b.Id ?? b.beneficioId ?? slug(b.titulo ?? "")),
            categoriaId,
            proveedorId,
            categoriaNombre: b.categoriaNombre ?? b.categoria?.nombre ?? b.categoria ?? "",
            proveedorNombre: b.proveedorNombre ?? b.proveedor?.nombre ?? b.proveedor ?? "",
            imagen,
            imagenUrl: imagen, // compat con la Card
            precio: b.precio ?? b.precioCRC ?? null, // para money()
            precioCRC: b.precioCRC ?? b.precio ?? null, // por si lo necesitás directo
            vigenciaInicio: b.vigenciaInicio ? String(b.vigenciaInicio).slice(0,10) : "",
            vigenciaFin: b.vigenciaFin ? String(b.vigenciaFin).slice(0,10) : "",
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

  // ============== FILTRO ROBUSTO ==============
  const filtered = useMemo(() => {
    const q = lower(query);
    return items.filter((b) => {
      const bCatId    = lower(b.categoriaId);
      const bProvId   = lower(b.proveedorId);
      const bCatName  = lower(b.categoriaNombre);
      const bProvName = lower(b.proveedorNombre);

      // Categoría
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

      // Proveedor
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

      // Texto
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
        const imagen = normalizeImage(updated.imagen ?? updated.imagenUrl ?? editing.imagen ?? editing.imagenUrl ?? "");
        const norm = {
          ...editing,
          ...updated,
          id: normId(updated.id ?? updated.Id ?? updated.beneficioId ?? editing.id),
          categoriaId: normId(updated.categoriaId ?? editing.categoriaId),
          proveedorId: normId(updated.proveedorId ?? editing.proveedorId),
          categoriaNombre: updated.categoriaNombre ?? editing.categoriaNombre ?? "",
          proveedorNombre: updated.proveedorNombre ?? editing.proveedorNombre ?? "",
          imagen,
          imagenUrl: imagen,
          precio: updated.precio ?? updated.precioCRC ?? editing.precio ?? editing.precioCRC ?? null,
          precioCRC: updated.precioCRC ?? updated.precio ?? editing.precioCRC ?? editing.precio ?? null,
          vigenciaInicio: updated.vigenciaInicio ? String(updated.vigenciaInicio).slice(0,10) : (editing.vigenciaInicio ?? ""),
          vigenciaFin: updated.vigenciaFin ? String(updated.vigenciaFin).slice(0,10) : (editing.vigenciaFin ?? ""),
        };
        setItems(list => list.map(x => (x.id === editing.id ? norm : x)));
      } else {
        const created = await BeneficioApi.create(dto);
        const imagen = normalizeImage(created.imagen ?? created.imagenUrl ?? dto.imagenUrl ?? "");
        const norm = {
          ...created,
          id: normId(created.id ?? created.Id ?? created.beneficioId),
          categoriaId: normId(created.categoriaId),
          proveedorId: normId(created.proveedorId),
          categoriaNombre: created.categoriaNombre ?? "",
          proveedorNombre: created.proveedorNombre ?? "",
          imagen,
          imagenUrl: imagen,
          precio: created.precio ?? created.precioCRC ?? null,
          precioCRC: created.precioCRC ?? created.precio ?? null,
          vigenciaInicio: created.vigenciaInicio ? String(created.vigenciaInicio).slice(0,10) : "",
          vigenciaFin: created.vigenciaFin ? String(created.vigenciaFin).slice(0,10) : "",
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
    const created = await CategoriaApi.create({ titulo }); // adminApi mapea a { nombre }
    const nodo = { ...created, id: normId(created.id ?? created.categoriaId ?? created.Id), titulo: created.titulo ?? created.nombre ?? titulo };
    setCats(s => [nodo, ...s]);
    return nodo;
  }
  async function addProveedor(nombre) {
    const created = await ProveedorApi.create({ nombre });
    const nodo = { ...created, id: normId(created.id ?? created.proveedorId ?? created.Id), nombre: created.nombre ?? nombre };
    setProvs(s => [nodo, ...s]);
    return nodo;
  }

  async function renameCategoria(r, nuevoTitulo) {
    const updated = await CategoriaApi.update(r.id, { ...r, titulo: nuevoTitulo }); // se mapea a { nombre }
    const nodo = { ...updated, id: normId(updated.id ?? updated.categoriaId ?? r.id), titulo: updated.titulo ?? updated.nombre ?? nuevoTitulo };
    setCats(s => s.map(x => x.id === r.id ? nodo : x));
  }
  async function renameProveedor(r, nuevoNombre) {
    const updated = await ProveedorApi.update(r.id, { ...r, nombre: nuevoNombre });
    const nodo = { ...updated, id: normId(updated.id ?? updated.proveedorId ?? r.id), nombre: updated.nombre ?? nuevoNombre };
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

  // helper: scroll suave a sub-sección (chips)
  const scrollInto = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={cls(
        "min-h-screen bg-neutral-950 text-white md:grid",
        collapsed ? "md:grid-cols-[64px_1fr]" : "md:grid-cols-[260px_1fr]"
      )}
    >
      {/* Sidebar */}
      <aside className="bg-neutral-950 border-r border-white/10 hidden md:flex flex-col">
        <div className="h-14 md:h-16 flex items-center px-4 border-b border-white/10">
          <div className="font-semibold">{collapsed ? "HR" : "HR Beneficios"}</div>
          <button
            className="ml-auto text-white/60 hover:text-white"
            onClick={toggleCollapsedAndSave}
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="p-2 flex-1 space-y-1">
          {/* Padre */}
          <NavItem
            label="Beneficios"
            icon={<IconGift className="w-5 h-5" />}
            active={nav==="beneficios"}
            collapsed={collapsed}
            onClick={()=>setNav("beneficios")}
          />

          {/* Hijos de Beneficios (visibles como hijos cuando no está colapsado) */}
          {!collapsed && (
            <div className="pl-8 mt-1 space-y-1">
              <SubNavItem
                label="Categorías"
                icon={<IconTag className="w-4 h-4" />}
                active={nav==="categorias"}
                onClick={()=>setNav("categorias")}
              />
              <SubNavItem
                label="Proveedores"
                icon={<IconBuilding className="w-4 h-4" />}
                active={nav==="proveedores"}
                onClick={()=>setNav("proveedores")}
              />
            </div>
          )}
        </nav>

        <div className="p-3 text-xs text-white/50 border-t border-white/10">
          {collapsed ? "v1" : "Versión 1.0.0"}
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="h-14 md:h-16 flex items-center gap-2 md:gap-3 px-3 md:px-6 border-b border-white/10 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
          {/* móvil: menú hamburguesa */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 -ml-1"
            onClick={() => setShowMobileNav(true)}
            aria-label="Abrir menú"
          >
            <IconMenu className="w-6 h-6 text-white/90" />
          </button>

          <h1 className="font-semibold capitalize hidden sm:block">{nav}</h1>

          {nav === "beneficios" && (
            <>
              <input
                placeholder="Buscar beneficios"
                className="ml-auto w-[55%] sm:w-64 md:w-80 rounded-lg bg-neutral-900 border border-white/10 px-3 py-1.5 md:py-2
                           text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20
                           hidden md:block"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
              />
              {/* móvil: lupa */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/5 ml-auto"
                onClick={()=>setMobileSearchOpen(v=>!v)}
                aria-label={mobileSearchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
              >
                <IconSearch className="w-6 h-6 text-white/90" />
              </button>
            </>
          )}
        </div>

        {/* Overlay buscador móvil */}
        {mobileSearchOpen && nav === "beneficios" && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60"
            onClick={()=>setMobileSearchOpen(false)}
          >
            <div
              className="absolute top-0 left-0 right-0 p-3 bg-neutral-950 border-b border-white/10 flex items-center gap-3"
              onClick={(e)=>e.stopPropagation()}
            >
              <IconSearch className="w-6 h-6 text-white/80" />
              <input
                autoFocus
                placeholder="Buscar beneficios..."
                className="flex-1 bg-transparent border-0 outline-none text-white placeholder-white/50 text-base"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
              />
              <button
                onClick={()=>setMobileSearchOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5"
                aria-label="Cerrar"
              >
                <IconX className="w-6 h-6 text-white/80" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-3 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            {error && <Alert tone="error" message={error} />}
            {loading && !error && <Alert tone="info" message="Cargando datos..." />}

            {nav === "beneficios" && (
              <section className="space-y-4">
                {/* Chips */}
                <div className="flex flex-col gap-3">
                  {/* Categorías */}
                  <div ref={catsRowRef} className="flex gap-2 overflow-x-auto pb-1 snap-x -mx-1 px-1">
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
                  <div ref={provsRowRef} className="flex gap-2 overflow-x-auto pb-1 snap-x -mx-1 px-1">
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
        active ? "bg-neutral-800 text-white" : "hover:bg-white/10 text-white/90",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? label : undefined}
    >
      <span className="text-lg w-5 h-5 grid place-items-center">{icon}</span>
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}

function SubNavItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition",
        active ? "bg-neutral-800 text-white"
               : "text-white/85 hover:bg-white/5"
      )}
    >
      <span className="w-4 h-4 grid place-items-center">{icon}</span>
      <span>{label}</span>
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
  const [src, setSrc] = useState(item.imagenUrl ?? item.imagen ?? "");

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (src || !item?.id) return;        // ya hay imagen, no hagas nada
      try {
        const full = await BeneficioApi.get(item.id); // ← usa el detalle como el cliente
        const raw =
          full?.imagenUrl ?? full?.ImagenUrl ??
          full?.imagenBase64 ?? full?.ImagenBase64 ??
          full?.imagen ?? full?.Imagen ?? "";
        if (!cancel && raw) {
          const url =
            /^data:|^https?:/i.test(raw)
              ? raw
              : `data:image/jpeg;base64,${String(raw).replace(/\s/g, "")}`;
          setSrc(url);
        }
      } catch (e) {
        // silencioso: si falla, la card quedará "Sin imagen"
        console.debug("No se pudo hidratar imagen", item?.id, e);
      }
    })();
    return () => { cancel = true; };
  }, [item?.id, src]);

  const precioMostrar = item.precioCRC ?? item.precio ?? null;

  return (
    <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
      <div className="relative">
        <div className="absolute left-3 top-3 z-10">
          <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
            {item.categoriaNombre}
          </span>
        </div>
        <div className="aspect-video bg-neutral-800 grid place-items-center text-white/50">
          {src
            ? <img className="w-full h-full object-cover" src={src} alt={item.titulo} />
            : <div>Sin imagen</div>}
        </div>
      </div>
      <div className="p-3">
        <div className="text-sm text-white/70">{item.proveedorNombre}</div>
        <div className="text-lg font-semibold">{item.titulo}</div>
        <div className="text-sm text-white/60">₡ {precioMostrar != null ? Number(precioMostrar).toLocaleString("es-CR") : "—"}</div>
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

/* ====== Alert bar (mejor arte) ====== */
function Alert({ tone = "info", message }) {
  const isError = tone === "error";
  return (
    <div className={cls(
      "rounded-xl border px-3 py-2 flex items-center gap-2",
      isError ? "border-red-500/30 bg-red-500/[0.08] text-red-200"
              : "border-white/10 bg-white/5 text-white/90"
    )}>
      <span className="w-5 h-5">
        {isError ? <IconError className="w-5 h-5" /> : <IconInfo className="w-5 h-5" />}
      </span>
      <span className="text-sm">{message}</span>
    </div>
  );
}

/* ====== Form overlay ====== */
function FullForm({ initial, cats, provs, onCreateCat, onCreateProv, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({
    titulo:        initial?.titulo ?? "",
    // el API usa precioCRC; el form trabaja en 'precio' y el mapeo a API lo hace adminApi
    precio:        initial?.precio ?? initial?.precioCRC ?? "",
    proveedorId:   initial?.proveedorId ? normId(initial.proveedorId) : "",
    categoriaId:   initial?.categoriaId ? normId(initial.categoriaId) : "",
    descripcion:   initial?.descripcion ?? "",
    condiciones:   initial?.condiciones ?? "",
    vigenciaInicio: initial?.vigenciaInicio ? String(initial.vigenciaInicio).slice(0,10) : "",
    vigenciaFin:    initial?.vigenciaFin ? String(initial.vigenciaFin).slice(0,10) : "",
    imagenUrl:     initial?.imagen ?? initial?.imagenUrl ?? "",
    // campo que usaremos para enviar base64 puro al back SOLO si cambió
    nuevaImagenBase64: null,
    imagen: null, // compat con BeneficioApi (envía 'imagen' si existe)
  }));
  const [preview, setPreview] = useState(() => form.imagenUrl);

  // mini-prompt estilado para “+ nuevo/+ nueva”
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptType, setPromptType] = useState(null); // 'prov' | 'cat'
  const [promptValue, setPromptValue] = useState("");

  // === Scroll helper: evita que los selects/dates queden tapados por el header
  const scrollerRef = useRef(null);
  function revealBeforeOpen(el) {
    const sc = scrollerRef.current;
    if (!sc || !el) return;
    const GUARD = 72; // margen con el header
    const sRect = sc.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const topInScroller = eRect.top - sRect.top;
    if (topInScroller >= GUARD) return;
    const delta = topInScroller - GUARD;
    sc.scrollTop += delta;
  }

  function openPrompt(type){
    setPromptType(type);
    setPromptValue("");
    setPromptOpen(true);
  }
  async function confirmPrompt(){
    if(!promptValue.trim()) { setPromptOpen(false); return; }
    if(promptType === "prov"){
      const n = await onCreateProv(promptValue.trim());
      setForm(s=>({...s, proveedorId:normId(n.id)}));
    } else {
      const n = await onCreateCat(promptValue.trim());
      setForm(s=>({...s, categoriaId:normId(n.id)}));
    }
    setPromptOpen(false);
  }

  // === Manejo de archivo: convertimos a base64 puro y lo guardamos en form
  async function handleFile(file){
    if(!file){
      setPreview("");
      setForm(s=>({...s, imagenUrl:"", nuevaImagenBase64:null, imagen:null }));
      return;
    }
    try {
      const base64 = await fileToBase64Pure(file); // ← base64 sin data:
      const dataUrl = `data:${file.type || "image/jpeg"};base64,${base64}`;
      setPreview(dataUrl);
      // Guardamos para el payload (ambos por compatibilidad con tu adminApi actual)
      setForm(s=>({
        ...s,
        imagenUrl: dataUrl,
        nuevaImagenBase64: base64,
        imagen: base64,
      }));
    } catch(err){
      console.error(err);
    }
  }

  // Al guardar, garantizamos GUIDs válidos. Si están vacíos, usamos los del "initial" (edición)
  function submit(e){
    e.preventDefault();
    const provId = isGuid(form.proveedorId) ? form.proveedorId : (initial?.proveedorId || "");
    const catId  = isGuid(form.categoriaId) ? form.categoriaId : (initial?.categoriaId || "");

    const dto = {
      ...form,
      proveedorId: provId,
      categoriaId: catId,
      // si no se cambió la imagen, enviamos null para conservarla en back
      imagen: form.nuevaImagenBase64 ? form.nuevaImagenBase64 : null,
    };

    onSave(dto);
  }

  const baseInput = "w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20";

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur">
      <div className="absolute inset-0 flex md:items-center md:justify-center">
        {/* Wrapper: recorta y deja el scroll en el área inferior */}
        <div className="relative w-full md:w-[920px] max-h-full md:max-h-[92vh] bg-neutral-950 border-l md:border border-white/10 md:rounded-2xl overflow-hidden md:my-6 md:shadow-2xl">
          {/* Header fijo */}
          <div className="h-14 px-4 flex items-center gap-3 bg-neutral-950/80 backdrop-blur border-b border-white/10">
            <button type="button" onClick={onCancel}
              className="rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-3 py-1.5">
              Cerrar
            </button>
            <div className="text-lg font-semibold flex-1">
              {initial ? "Editar beneficio" : "Nuevo beneficio"}
            </div>
            <button
              form="benef-form"
              className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white font-semibold px-4 py-2">
              Guardar
            </button>
          </div>

          {/* Área scrolleable */}
          <div
            ref={scrollerRef}
            className="overflow-auto max-h-[calc(100vh-56px)] md:max-h-[calc(92vh-56px)]"
          >
            <form id="benef-form" onSubmit={submit} className="p-4 md:p-6 space-y-4 text-[14px] md:text-base leading-6">
              {/* Datos principales */}
              <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
                <h3 className="font-semibold">Datos principales</h3>

                <div className="space-y-2">
                  <label className="text-sm">Título</label>
                  <input className={baseInput}
                    value={form.titulo}
                    onChange={e=>setForm(s=>({...s, titulo:e.target.value}))}
                    required />
                </div>

                <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
                  <div className="space-y-2">
                    <label className="text-sm">Precio (CRC)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1"
                      className={cls(
                        baseInput,
                        "appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      )}
                      value={form.precio}
                      onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                      onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                      onChange={e=>setForm(s=>({...s, precio:e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Moneda</label>
                    <input disabled value="CRC" className={cls(baseInput, "opacity-60")} />
                  </div>
                </div>

                <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
                  {/* Proveedor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Proveedor</label>
                      <button type="button" onClick={()=>openPrompt("prov")}
                        className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white">
                        + nuevo
                      </button>
                    </div>

                    <div className="relative">
                      <select
                        className={cls(baseInput, "appearance-none pr-10")}
                        value={form.proveedorId}
                        onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                        onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                        onChange={e=>setForm(s=>({...s, proveedorId:normId(e.target.value)}))}
                      >
                        <option value="">-- Seleccione --</option>
                        {provs.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>

                  {/* Categoría */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Categoría</label>
                      <button type="button" onClick={()=>openPrompt("cat")}
                        className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white">
                        + nueva
                      </button>
                    </div>

                    <div className="relative">
                      <select
                        className={cls(baseInput, "appearance-none pr-10")}
                        value={form.categoriaId}
                        onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                        onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                        onChange={e=>setForm(s=>({...s, categoriaId:normId(e.target.value)}))}
                      >
                        <option value="">-- Seleccione --</option>
                        {cats.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              </section>

              {/* Imagen */}
              <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
                <h3 className="font-semibold">Imagen</h3>

                <FileUpload fileUrl={preview} onPick={(f)=>handleFile(f)} />

                <div className="mt-2 aspect-video bg-neutral-800 rounded-xl grid place-items-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white/50 text-sm">Sin imagen</div>
                  )}
                </div>
              </section>

              {/* Descripción y condiciones */}
              <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
                <h3 className="font-semibold">Descripción y condiciones</h3>

                <div className="space-y-2">
                  <label className="text-sm">Descripción</label>
                  <textarea className={baseInput}
                    rows={4}
                    value={form.descripcion}
                    onChange={e=>setForm(s=>({...s, descripcion:e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Condiciones</label>
                  <textarea className={baseInput}
                    rows={3}
                    value={form.condiciones}
                    onChange={e=>setForm(s=>({...s, condiciones:e.target.value}))}
                  />
                </div>

                <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
                  <div className="space-y-2">
                    <label className="text-sm">Vigencia inicio</label>
                    <input
                      type="date"
                      className={baseInput}
                      value={form.vigenciaInicio}
                      onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                      onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                      onChange={e=>setForm(s=>({...s, vigenciaInicio:e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Vigencia fin</label>
                    <input
                      type="date"
                      className={baseInput}
                      value={form.vigenciaFin}
                      onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                      onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                      onChange={e=>setForm(s=>({...s, vigenciaFin:e.target.value}))}
                    />
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Mini prompt estilado */}
          {promptOpen && (
            <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 p-4 shadow-xl">
                <div className="text-lg font-semibold mb-3">
                  {promptType === "prov" ? "Nuevo proveedor" : "Nueva categoría"}
                </div>
                <input
                  autoFocus
                  className="w-full rounded-lg bg-neutral-950 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20"
                  placeholder="Escribe un nombre…"
                  value={promptValue}
                  onChange={(e)=>setPromptValue(e.target.value)}
                  onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); confirmPrompt(); } }}
                />
                <div className="mt-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={()=>setPromptOpen(false)}
                    className="rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-3 py-1.5">
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmPrompt}
                    className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-1.5">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ====== Controles auxiliares estilados ====== */
function fileToBase64Pure(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result || "");
      const i = s.indexOf("base64,");
      res(i >= 0 ? s.slice(i + 7) : s);   // ← base64 puro
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

// Chevron del <select>
function ChevronDown(){
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70"
      viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.19l3.71-2.96a.75.75 0 1 1 .94 1.16l-4.24 3.38a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" clipRule="evenodd"/>
    </svg>
  );
}

// FileUpload con botón estilado y nombre del archivo
function FileUpload({ fileUrl, onPick }) {
  const [name, setName] = useState("");

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="relative inline-flex">
        <input
          type="file"
          accept="image/*"
          className="peer sr-only"
          onChange={async (e)=>{
            const f = e.target.files?.[0];
            setName(f ? f.name : "");
            if (onPick) await onPick(f ?? null);
          }}
        />
        <span className="cursor-pointer rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-2 text-sm font-medium">
          {fileUrl ? "Cambiar" : "Elegir archivo"}
        </span>
      </label>
      <span className="text-white/70 text-sm truncate max-w-[60ch]">
        {name || (fileUrl ? "1 archivo seleccionado" : "Ningún archivo seleccionado")}
      </span>
    </div>
  );
}

function MobileSidebar({ open, current, onSelect, onClose }) {
  if (!open) return null;

  const items = [
    { key: "beneficios",  label: "Beneficios",  icon: <IconGift className="w-5 h-5" />, level: 0 },
    { key: "categorias",  label: "Categorías",  icon: <IconTag className="w-5 h-5"  />, level: 1 },
    { key: "proveedores", label: "Proveedores", icon: <IconBuilding className="w-5 h-5" />, level: 1 },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel (drawer) */}
      <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-neutral-950 border-r border-white/10 shadow-2xl">
        {/* Header compacto */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10">
          <div className="font-semibold text-base">HR Beneficios</div>
          <button
            className="ml-auto p-2 rounded-lg hover:bg-white/5"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <IconX className="w-6 h-6 text-white/90" />
          </button>
        </div>

        {/* Opciones */}
        <nav className="p-2 space-y-1">
          {items.map((i) => {
            const active = current === i.key;
            return (
              <button
                key={i.key}
                onClick={() => onSelect(i.key)}
                className={cls(
                  "w-full flex items-center gap-3 py-2 rounded-2xl text-left px-3",
                  active ? "bg-neutral-800 text-white"
                         : "bg-neutral-900 border border-white/10 hover:bg-neutral-800/70 text-white/90",
                  i.level === 1 && "pl-8"
                )}
              >
                <span className="w-5 h-5 grid place-items-center">{i.icon}</span>
                <span className="font-medium">{i.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
