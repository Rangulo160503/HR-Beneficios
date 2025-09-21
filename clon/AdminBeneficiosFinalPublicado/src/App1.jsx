// src/components/AdminShell.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { BeneficioApi, CategoriaApi, ProveedorApi } from "./services/adminApi";
import { Users } from "lucide-react";

/* ====== Helpers ====== */
const money = (v) => (v == null ? "" : Number(v).toLocaleString("es-CR"));
const cls = (...a) => a.filter(Boolean).join(" ");
const normId = (v) => (v == null ? "" : String(v).trim());
const lower  = (v) => normId(v).toLowerCase();

// GUID checker (para evitar PUT con ids inválidos)
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isGuid = (s) => typeof s === "string" && GUID_RE.test(s);

// --- Selección resiliente (si no hay id, usamos name:<etiqueta>)
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

const HR_PORTAL_IP = "http://10.30.100.94/";

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
    <path d="M6 6l12 12M16 6L6 18" strokeWidth="2" strokeLinecap="round"/>
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
// Wrapper para Users de lucide-react
const IconUsers = (p) => <Users {...p} />;

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
  const ac = new AbortController();
  let alive = true;

  (async () => {
    try {
      setLoading(true);
      setError("");

      const [Craw, Praw, Braw] = await Promise.all([
        CategoriaApi.list({ signal: ac.signal }),
        ProveedorApi.list({ signal: ac.signal }),
        BeneficioApi.list({ signal: ac.signal }),
      ]);

      if (!alive) return;

      // Helpers locales
      const byId = (arr, key = "id") => {
        const m = new Map();
        for (const x of arr) {
          const k = normId(x?.[key]);
          if (k && !m.has(k)) m.set(k, x);
        }
        return Array.from(m.values());
      };
      const str = (v) => (v == null ? "" : String(v).trim());

      // ----- Categorías -----
      const C_raw = (Array.isArray(Craw) ? Craw : []);
      const C_norm = C_raw.map(c => {
  const id = getCatId(c);
  const titulo = str(c.titulo ?? c.Titulo ?? c.nombre ?? c.Nombre);
  return id && titulo ? { ...c, id, titulo } : null;
}).filter(Boolean);
      const C = byId(C_norm, "id")
        .sort((a,b) => a.titulo.localeCompare(b.titulo, "es", { sensitivity:"base" }));

      // ----- Proveedores -----
      const P_raw = (Array.isArray(Praw) ? Praw : []);
      const P_norm = P_raw.map(p => {
        const id = normId(p.id ?? p.proveedorId ?? p.Id ?? p.ProveedorId);
        const nombre = str(p.nombre ?? p.Nombre ?? p.titulo ?? p.Titulo);
        return id && nombre ? { ...p, id, nombre } : null;
      }).filter(Boolean);
      const P = byId(P_norm, "id")
        .sort((a,b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity:"base" }));

      // ----- Beneficios -----
      const B_raw = (Array.isArray(Braw) ? Braw : []);
      const B = B_raw.map(b => {
        const id = normId(b.id ?? b.Id ?? b.beneficioId ?? slug(str(b.titulo ?? b.Titulo)));
        const categoriaId = normId(b.categoriaId ?? b.CategoriaId ?? b.categoria?.id ?? b.categoria);
        const proveedorId = normId(b.proveedorId ?? b.ProveedorId ?? b.proveedor?.id ?? b.proveedor);
        const categoriaNombre = str(b.categoriaNombre ?? b.categoria?.nombre ?? b.categoria ?? "");
        const proveedorNombre = str(b.proveedorNombre ?? b.proveedor?.nombre ?? b.proveedor ?? "");
        const imagen = normalizeImage(b.imagen ?? b.imagenUrl ?? b.ImagenUrl ?? "");
        const precio = b.precio ?? b.precioCRC ?? null;
        const precioCRC = b.precioCRC ?? b.precio ?? null;

        if (!id) return null;
        return {
          ...b,
          id,
          categoriaId,
          proveedorId,
          categoriaNombre,
          proveedorNombre,
          imagen,
          imagenUrl: imagen,
          precio: typeof precio === "number" ? precio : (precio != null ? Number(precio) : null),
          precioCRC: typeof precioCRC === "number" ? precioCRC : (precioCRC != null ? Number(precioCRC) : null),
          vigenciaInicio: b.vigenciaInicio ? String(b.vigenciaInicio).slice(0,10) : "",
          vigenciaFin: b.vigenciaFin ? String(b.vigenciaFin).slice(0,10) : "",
          titulo: str(b.titulo ?? b.Titulo ?? ""),
          descripcion: str(b.descripcion ?? b.Descripcion ?? ""),
          moneda: str(b.moneda ?? b.Moneda ?? b.divisa ?? ""),
          disponible: b.disponible ?? b.Disponible ?? true,
        };
      }).filter(Boolean);

      setCats(C);
      setProvs(P);
      setItems(B);
    } catch (e) {
      if (e?.name === "AbortError") return;
      console.error(e);
      setError("No se pudieron cargar los datos. Verifica API_BASE, CORS y que el API esté arriba.");
    } finally {
      if (alive) setLoading(false);
    }
  })();

  return () => { alive = false; ac.abort(); };
}, []);


  // ============== FILTRO ROBUSTO ==============
  // --- helpers de matching para chips (respetan id ó nombre seleccionado)
function matchCatSel(b, sel) {
  if (!sel) return true;
  const bCatId   = lower(b.categoriaId);
  const bCatName = lower(b.categoriaNombre);
  if (isNameSel(sel)) {
    const wanted = lower(nameOfSel(sel));
    return !!wanted && bCatName === wanted;
  }
  const wanted = lower(sel);
  return !!wanted && bCatId === wanted;
}
function matchProvSel(b, sel) {
  if (!sel) return true;
  const bProvId   = lower(b.proveedorId);
  const bProvName = lower(b.proveedorNombre);
  if (isNameSel(sel)) {
    const wanted = lower(nameOfSel(sel));
    return !!wanted && bProvName === wanted;
  }
  const wanted = lower(sel);
  return !!wanted && bProvId === wanted;
}

// 1) Filtrar SOLO por texto (base para armar chips visibles)
const itemsByText = useMemo(() => {
  const q = lower(query);
  if (!q) return items;
  return items.filter((b) => {
    const hayTexto = [b.titulo, b.proveedorNombre, b.categoriaNombre]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hayTexto.includes(q);
  });
}, [items, query]);

const isMeaningfulLabel = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return false;
  if (/^[-–—]+$/.test(s)) return false; // solo guiones
  if (s.length < 2) return false;
  return true;
};


// 2) Con el resultado por texto, calcular universo para cada chip:
//    - visibleCats: respeta texto + proveedor seleccionado
//    - visibleProvs: respeta texto + categoría seleccionada
const itemsForCats  = useMemo(() => itemsByText.filter(b => matchProvSel(b, selProv)), [itemsByText, selProv]);
const itemsForProvs = useMemo(() => itemsByText.filter(b => matchCatSel(b, selCat)),  [itemsByText, selCat]);

// 3) Construir conjuntos de ids -> nombres (incluye los que NO estén en las listas cargadas)
const visibleCats = useMemo(() => {
  const hit = new Map(); // sel -> label
  for (const b of itemsForCats) {
    const rawId = normId(b.categoriaId);
    const label =
      String(
    b.categoriaNombre ??
    cats.find(c => getCatId(c) === rawId)?.titulo ?? // <-- usa getCatId
    ""
  ).trim();

    // Si no hay GUID, solo agregamos si el label es “bueno”
    if (!rawId) {
      if (!isMeaningfulLabel(label)) continue;
      const sel = `name:${label}`;
      if (!hit.has(sel)) hit.set(sel, label);
      continue;
    }

    // Hay GUID: intenta poner un label útil; si no hay, intenta del catálogo
    const finalLabel = isMeaningfulLabel(label)
      ? label
      : String(cats.find(c => getCatId(c) === rawId)?.titulo ?? "").trim();

    // Si sigue sin label, no generes chip “mudo”
    if (!isMeaningfulLabel(finalLabel)) continue;

    if (!hit.has(rawId)) hit.set(rawId, finalLabel);
  }
  const arr = Array.from(hit, ([sel, label]) => ({ sel, label }));
  arr.sort((a,b) => a.label.localeCompare(b.label, "es", { sensitivity:"base" }));
  return arr;
}, [itemsForCats, cats]);

const visibleProvs = useMemo(() => {
  const hit = new Map(); // sel -> label
  for (const b of itemsForProvs) {
    const rawId = normId(b.proveedorId);
    const label =
      String(
        b.proveedorNombre ??
        provs.find(p => normId(p.id ?? p.proveedorId) === rawId)?.nombre ??
        ""
      ).trim();

    if (!rawId) {
      if (!isMeaningfulLabel(label)) continue;
      const sel = `name:${label}`;
      if (!hit.has(sel)) hit.set(sel, label);
      continue;
    }

    const finalLabel = isMeaningfulLabel(label)
      ? label
      : String(provs.find(p => normId(p.id ?? p.proveedorId) === rawId)?.nombre ?? "").trim();

    if (!isMeaningfulLabel(finalLabel)) continue;

    if (!hit.has(rawId)) hit.set(rawId, finalLabel);
  }
  const arr = Array.from(hit, ([sel, label]) => ({ sel, label }));
  arr.sort((a,b) => a.label.localeCompare(b.label, "es", { sensitivity:"base" }));
  return arr;
}, [itemsForProvs, provs]);



// 4) Filtrado final de la grilla (texto + categoría + proveedor)
const filtered = useMemo(() => {
  return items.filter((b) => matchCatSel(b, selCat) && matchProvSel(b, selProv)).filter((b) => {
    const q = lower(query);
    if (!q) return true;
    const hayTexto = [b.titulo, b.proveedorNombre, b.categoriaNombre]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hayTexto.includes(q);
  });
}, [items, selCat, selProv, query]);



  function openNew() { setEditing(null); setShowForm(true); }
async function openEdit(it) {
  try {
    const full = await BeneficioApi.get(it.id); // ← trae proveedorId y categoriaId
    setEditing({ ...it, ...full });
  } catch {
    setEditing(it); // fallback si falla el GET
  }
  setShowForm(true);
}


  // ============== CRUD: Beneficio ==============
  async function saveBeneficio(dto) {
    try {
      setError("");

      if (editing) {
        // PUT ya no devuelve objeto
        await BeneficioApi.update(editing.id, dto);

        // Trae el canónico desde el backend
        const fresh = await BeneficioApi.get(editing.id);

        // Reemplaza en memoria
        setItems(list => list.map(x => (x.id === editing.id ? fresh : x)));
      } else {
        // POST retorna GUID
        const newId = await BeneficioApi.create(dto);

        // Trae el canónico
        const fresh = await BeneficioApi.get(newId);

        // Agrega al inicio
        setItems(s => [fresh, ...s]);
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
 async function addCategoria(nombreInput) {
  const nombre = String(nombreInput ?? "").trim();
  if (!nombre) throw new Error("El nombre es requerido.");

  // Intenta crear y obtener ID (puede regresar string u objeto)
  let res = null;
  try { res = await CategoriaApi.create({ nombre }); } catch {}

  let id = typeof res === "string" ? normId(res) : getCatId(res);
  let created = null;

  // Si ya hay id, trae el objeto canónico
  if (id) {
    try { created = await CategoriaApi.get(id); } catch {}
  }

  // Fallback: busca por nombre en el listado
  if (!created) {
    try {
      const all = await CategoriaApi.list();
      created = all.find(x =>
        String(x?.nombre ?? x?.titulo ?? "").trim().toLowerCase()
        === nombre.toLowerCase()
      ) || null;
      if (!id) id = getCatId(created);
    } catch {}
  }

  // Construye el nodo con ID forzado
  const finalId = id || getCatId(created) || "";
  const nodo = {
    ...created,
    id: finalId,
    categoriaId: finalId,
    nombre: created?.nombre ?? nombre,
    titulo: created?.titulo ?? created?.nombre ?? nombre, // por compatibilidad de UI
  };

  setCats(s => [nodo, ...s]);
  return nodo;
}

  async function addProveedor(nombre) {
    const id = await ProveedorApi.create({ nombre });   // ← GUID
    const created = await ProveedorApi.get(id);         // ← objeto
    const nodo = {
      ...created,
      id: normId(created.id ?? created.proveedorId ?? created.Id),
      nombre: created.nombre ?? nombre
    };
    setProvs(s => [nodo, ...s]);
    return nodo;
  }

  // --- Renombrar categoría (robusto a distintos payloads del API)
  async function renameCategoria(r, nuevoNombre) {
    const id = getCatId(r);
    if (!id) { alert("Categoría sin ID válido."); return; }
    const nombre = String(nuevoNombre ?? "").trim();
    if (!nombre) { alert("El nombre/título es requerido."); return; }

    await CategoriaApi.update(id, { nombre, activa: r?.activa ?? true }); // PUT sin body
    const updated = await CategoriaApi.get(id);                            // objeto canónico

    const updatedId = normId(updated?.categoriaId ?? updated?.id ?? id);
    const canon = updated?.nombre ?? updated?.titulo ?? nombre;

    const nodo = {
      ...r,
      ...updated,
      id: updatedId,
      categoriaId: updatedId,
      titulo: canon,
      nombre: canon,
      activa: typeof updated?.activa === "boolean" ? updated.activa : (r.activa ?? true),
      modificadoEn: updated?.modificadoEn ?? new Date().toISOString(),
    };

    setCats(s => s.map(x => (getCatId(x) === id ? nodo : x)));
  }

  // --- Renombrar proveedor
  async function renameProveedor(r, nuevoNombre) {
    const id = getProvId(r);
    if (!id) { alert("Proveedor sin ID válido."); return; }
    const nombre = String(nuevoNombre ?? "").trim();
    if (!nombre) { alert("El nombre es requerido."); return; }

    await ProveedorApi.update(id, { nombre });  // PUT sin body
    const updated = await ProveedorApi.get(id); // objeto canónico

    const updatedId = normId(updated?.proveedorId ?? updated?.id ?? id);

    const nodo = {
      ...r,
      ...updated,
      id: updatedId,
      proveedorId: updatedId,
      nombre: updated?.nombre ?? nombre,
      modificadoEn: updated?.modificadoEn ?? new Date().toISOString(),
    };

    setProvs(s => s.map(x => (getProvId(x) === id ? nodo : x)));
  }

  async function renameCategoria(r, nuevoTitulo) {
  const id = getCatId(r);
  if (!id) { alert("Categoría sin ID válido."); return; }
  const titulo = String(nuevoTitulo ?? "").trim();
  if (!titulo) { alert("El título es requerido."); return; }

  await CategoriaApi.update(id, { titulo });   // PUT
  const updated = await CategoriaApi.get(id); // objeto canónico

  const updatedId = normId(updated?.categoriaId ?? updated?.id ?? id);

  const nodo = {
    ...r,
    ...updated,
    id: updatedId,
    categoriaId: updatedId,
    titulo: updated?.titulo ?? titulo,
    modificadoEn: updated?.modificadoEn ?? new Date().toISOString(),
  };

  setCats(s => s.map(x => (getCatId(x) === id ? nodo : x)));
}

  async function deleteCategoria(r) {
    const id = getCatId(r);
    if (!id) return;
    if (!confirm("¿Eliminar categoría?")) return;
    await CategoriaApi.remove(id);
    setCats(s => s.filter(x => getCatId(x) !== id));
  }

  async function deleteProveedor(r) {
    const id = getProvId(r);
    if (!id) return;
    if (!confirm("¿Eliminar proveedor?")) return;
    await ProveedorApi.remove(id);
    setProvs(s => s.filter(x => getProvId(x) !== id));
  }

  async function deleteCategoria(r) {
  const id = getCatId(r);
  if (!id) return;
  if (!confirm("¿Eliminar categoría?")) return;
  await CategoriaApi.remove(id);
  setCats(s => s.filter(x => getCatId(x) !== id));
}

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
        <button
  onClick={toggleCollapsedAndSave}
  className="font-semibold text-white/60 hover:text-white"
  title={collapsed ? "Expandir" : "Colapsar"}
>
  {collapsed ? "HR" : "HR Beneficios"}
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

          {/* Nuevo módulo HR Portal */}
         <a
  href="http://hrportal"
  target="_blank"
  rel="noopener noreferrer"
  className="contents"
>
  <NavItem
    label="HR Portal"
    icon={<IconUsers className="w-5 h-5" />}
    active={nav === "hrportal"}
    collapsed={collapsed}
  />
</a>

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
    {/* Desktop: buscador ghost, sin caja */}
    <div className="ml-auto hidden md:flex items-center">
      <div className="relative">
        <IconSearch
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
          aria-hidden="true"
        />
        <input
          placeholder="Buscar beneficios"
          className="pl-6 pr-2 py-1.5 bg-transparent border-0 border-b border-white/10 
                     text-white placeholder-white/50 outline-none
                     focus:border-white/30 transition-colors duration-200"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />
      </div>
    </div>

    {/* Móvil: botón fantasma (ya abre el overlay existente) */}
    <button
      className="md:hidden p-2 -ml-1 rounded-lg hover:bg-white/5"
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
<div
  ref={catsRowRef}
  className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar snap-x"
  style={{
    WebkitMaskImage:
      "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
    maskImage:
      "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
  }}
>
  <Chip active={!selCat} onClick={()=>setSelCat("")} label="Todas las categorías" />
  {visibleCats.map((c, i) => {
    const val = c.sel, label = c.label;
    const isActive = !!selCat && lower(selCat) === lower(val);
    return (
      <Chip
        key={keyOf("cat", val, label, i)}
        active={isActive}
        onClick={() => setSelCat(isActive ? "" : val)}
        label={label}
      />
    );
  })}
</div>

{/* Proveedores */}
<div
  ref={provsRowRef}
  className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar snap-x"
  style={{
    WebkitMaskImage:
      "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
    maskImage:
      "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
  }}
>
  <Chip active={!selProv} onClick={()=>setSelProv("")} label="Todos los proveedores" />
  {visibleProvs.map((p, i) => {
    const val = p.sel, label = p.label;
    const isActive = !!selProv && lower(selProv) === lower(val);
    return (
      <Chip
        key={keyOf("prov", val, label, i)}
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
        onSelect={(key) => {
          if (key === "hrportal") { window.location.assign("/hrportal/"); return; }
          setNav(key);
          setShowMobileNav(false);
        }}
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


function getProvId(r){ 
  return normId(r?.id ?? r?.proveedorId ?? r?.Id ?? r?.ProveedorId); }

function getCatId(r) {
  return normId(
    r?.id ??
    r?.Id ??
    r?.categoriaId ?? r?.CategoriaId ??
    r?.categoriaID ?? r?.CategoriaID ??
    r?.idCategoria ?? r?.IdCategoria ??
    r?.categoria?.id ?? r?.categoria?.Id
  );
}

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

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls(
        "inline-flex items-center gap-2 rounded-full",
        "px-3 py-1 text-sm md:text-[13px] font-medium tracking-tight",
        "border transition-colors duration-150",
        active
          ? "bg-white/10 border-white/30 text-white"
          : "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/8 hover:border-white/20"
      )}
    >
      <span
        className={cls(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-white" : "bg-white/40"
        )}
      />
      <span className="whitespace-nowrap">{label}</span>
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
    titulo:         initial?.titulo ?? "",
    precio:         initial?.precio ?? initial?.precioCRC ?? "",
    proveedorId:    initial?.proveedorId ? normId(initial.proveedorId)
                    : initial?.ProveedorId ? normId(initial.ProveedorId) : "",
    categoriaId:    initial?.categoriaId ? normId(initial.categoriaId)
                    : initial?.CategoriaId ? normId(initial.CategoriaId) : "",
    descripcion:    initial?.descripcion ?? "",
    condiciones:    initial?.condiciones ?? "",
    vigenciaInicio: initial?.vigenciaInicio ? String(initial.vigenciaInicio).slice(0,10) : "",
    vigenciaFin:    initial?.vigenciaFin    ? String(initial.vigenciaFin).slice(0,10)    : "",
    imagenUrl:      initial?.imagen ?? initial?.imagenUrl ?? "",
    nuevaImagenBase64: null,   // solo si el usuario sube nueva imagen
    imagen: null,              // base64 puro para payload
  }));
  const [preview, setPreview] = useState(() => form.imagenUrl);

  // mini-prompt crear proveedor/categoría
  const [promptOpen, setPromptOpen]   = useState(false);
  const [promptType, setPromptType]   = useState(null); // 'prov' | 'cat'
  const [promptValue, setPromptValue] = useState("");

  // === Scroll helper
  const scrollerRef = useRef(null);
  function revealBeforeOpen(el) {
    const sc = scrollerRef.current;
    if (!sc || !el) return;
    const GUARD = 72;
    const sRect = sc.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const topInScroller = eRect.top - sRect.top;
    if (topInScroller >= GUARD) return;
    sc.scrollTop += (topInScroller - GUARD);
  }

  function openPrompt(type){
    setPromptType(type);
    setPromptValue("");
    setPromptOpen(true);
  }
  async function confirmPrompt(){
  if(!promptValue.trim()) { setPromptOpen(false); return; }
  console.log('[confirmPrompt] tipo=', promptType, 'valor=', promptValue);

  if(promptType === "prov"){
    const n = await onCreateProv(promptValue.trim());
    console.log('[confirmPrompt] creado prov:', n);
    setForm(s => ({ ...s, proveedorId: normId(n.id) }));
  } else {
    const n = await onCreateCat(promptValue.trim());
    console.log('[confirmPrompt] creado cat:', n);
    setForm(s => ({ ...s, categoriaId: normId(n.id) }));
  }
  setPromptOpen(false);
}


  // === Manejo de archivo
  async function handleFile(file){
    if(!file){
      setPreview("");
      setForm(s=>({...s, imagenUrl:"", nuevaImagenBase64:null, imagen:null }));
      return;
    }
    try {
      const base64 = await fileToBase64Pure(file);
      const dataUrl = `data:${file.type || "image/jpeg"};base64,${base64}`;
      setPreview(dataUrl);
      setForm(s=>({ ...s, imagenUrl:dataUrl, nuevaImagenBase64:base64, imagen:base64 }));
    } catch(err){
      console.error(err);
    }
  }

  // ---------- IDs/labels actuales (aunque no estén en listas) ----------
  const currentProvId   = normId(initial?.proveedorId ?? initial?.ProveedorId);
  const currentProvName =
    initial?.proveedorNombre ??
    provs.find(p => normId(p.id) === currentProvId)?.nombre ??
    "(Proveedor actual)";
  const provValue  = form.proveedorId || currentProvId;
  const provInList = provs.some(p => normId(p.id) === provValue);

const currentCatId   = normId(initial?.categoriaId ?? initial?.CategoriaId);
 const currentCatName =
   initial?.categoriaNombre ??
   cats.find(c => getCatId(c) === currentCatId)?.nombre ??
   cats.find(c => getCatId(c) === currentCatId)?.titulo ??
   "(Categoría actual)";

const catValue  = normId(form.categoriaId || currentCatId);
const catInList = cats.some(c => getCatId(c) === catValue);


  // ---------- Autocompletar IDs si llegan vacíos usando el nombre ----------
  useEffect(() => {
    const toKey = (x) => (x ? String(x).trim().toLowerCase() : "");
    // proveedor
    if (!toKey(form.proveedorId) && toKey(initial?.proveedorNombre)) {
      const hit = provs.find(p => toKey(p?.nombre) === toKey(initial?.proveedorNombre));
      if (hit?.id) setForm(s => ({ ...s, proveedorId: normId(hit.id) }));
    }
    // categoría
    if (!toKey(form.categoriaId) && toKey(initial?.categoriaNombre)) {
      const hit = cats.find(c => toKey(c?.nombre) === toKey(initial?.categoriaNombre));
      if (hit?.id) setForm(s => ({ ...s, categoriaId: normId(hit.id) }));
    }
  }, [provs, cats, initial, form.proveedorId, form.categoriaId]);

  useEffect(() => {
    console.log('[FullForm] cats len=', cats.length, 'primero=', cats[0]);
  }, [cats]);
  useEffect(() => {
  const opts = cats.map(c => ({ id: getCatId(c), label: c.nombre ?? c.titulo }));
  console.log('[Dropdown Cat] value=', catValue, 'inList=', catInList, 'options=', opts);
}, [cats, catValue, catInList]);


  // ---------- Submit ----------
  function submit(e){
    e.preventDefault();

    // IDs: si no se cambian o están vacíos, usa los del registro actual
    const provId = isGuid(form.proveedorId) ? form.proveedorId : currentProvId;
    const catId  = isGuid(form.categoriaId) ? form.categoriaId : currentCatId;

    // Precio: si el input quedó vacío, reusa el actual
    const precioCRC =
      form.precio !== "" && form.precio != null
        ? Number(form.precio)
        : (Number(initial?.precioCRC ?? initial?.precio ?? 0) || 0);

    // Fechas: conserva las actuales si no se editaron
    const vIni = form.vigenciaInicio || (initial?.vigenciaInicio ? String(initial.vigenciaInicio).slice(0,10) : null);
    const vFin = form.vigenciaFin    || (initial?.vigenciaFin    ? String(initial.vigenciaFin).slice(0,10)    : null);

    // DTO limpio (imagen solo si hay nueva)
    const dto = {
      titulo:         (form.titulo || initial?.titulo || "").trim(),
      descripcion:    form.descripcion ?? initial?.descripcion ?? "",
      condiciones:    form.condiciones ?? initial?.condiciones ?? "",
      precioCRC,
      proveedorId:    provId || null,
      categoriaId:    catId  || null,
      vigenciaInicio: vIni,
      vigenciaFin:    vFin,
      ...(form.nuevaImagenBase64 ? { imagen: form.nuevaImagenBase64 } : {}),
    };

    // Validación mínima para evitar 400 por GUID inválidos
    if (!isGuid(dto.proveedorId) || !isGuid(dto.categoriaId)) {
      alert("Debe seleccionar Proveedor y Categoría.");
      return;
    }

    onSave(dto);
  }

  const baseInput =
    "w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20";

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur">
      <div className="absolute inset-0 flex md:items-center md:justify-center">
        {/* Wrapper */}
        <div className="relative w-full md:w-[920px] max-h-full md:max-h-[92vh] bg-neutral-950 border-l md:border border-white/10 md:rounded-2xl overflow-hidden md:my-6 md:shadow-2xl">
          {/* Header */}
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
                  <input
                    className={baseInput}
                    value={form.titulo}
                    onChange={e=>setForm(s=>({...s, titulo:e.target.value}))}
                    required
                  />
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
                        value={provValue}
                        onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                        onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                        onChange={e=>setForm(s=>({...s, proveedorId:normId(e.target.value)}))}
                      >
                        {!provInList && provValue && (
                          <option value={provValue}>{currentProvName}</option>
                        )}
                        <option value="">-- Seleccione --</option>
                        {provs.map(p => (
                          <option key={p.id} value={normId(p.id)}>{p.nombre}</option>
                        ))}
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
  value={catValue}  // <-- ya viene normalizado arriba
  onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
  onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
  onChange={(e)=>setForm(s=>({...s, categoriaId:normId(e.target.value)}))}
>
  {!catInList && catValue && (
    <option value={catValue}>{currentCatName}</option>
  )}
  <option value="">-- Seleccione --</option>

  {cats.map(c => {
    const id    = getCatId(c);                     // <— ID único/consistente
    const label = c.nombre ?? c.titulo ?? "—";     // <— por si viene en cualquiera
    return <option key={id} value={id}>{label}</option>;
  })}
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
                  <textarea
                    className={baseInput}
                    rows={4}
                    value={form.descripcion}
                    onChange={e=>setForm(s=>({...s, descripcion:e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Condiciones</label>
                  <textarea
                    className={baseInput}
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

          {/* Mini prompt */}
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
    { key: "hrportal",    label: "HR Portal",   icon: <IconUsers className="w-5 h-5" />, level: 0 },
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