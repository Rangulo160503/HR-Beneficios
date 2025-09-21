// src/components/AdminShell.jsx
import { useEffect, useMemo, useState } from "react";
import { BeneficioApi } from "../services/adminApi";
import CardNew from "./beneficio/CardNew";
import CardBeneficio from "./beneficio/CardBeneficio";
import FullForm from "./beneficio/FullForm";

// NUEVO:
import HeaderBar from "./header/HeaderBar";
import MobileSidebar from "./sidebar/MobileSidebar";

// Iconos simples en-línea para no agregar deps
const IconMenu   = (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/></svg>);
const IconSearch = (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M20 20l-4.2-4.2" strokeWidth="2" strokeLinecap="round"/></svg>);
const IconGift   = (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="1.8"/><path d="M12 8v13M3 12h18" strokeWidth="1.8"/></svg>);
const IconTag    = (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><path d="M20 13.5 10.5 4H5v5.5L14.5 19a2.1 2.1 0 0 0 3 0L20 16.5a2.1 2.1 0 0 0 0-3z" strokeWidth="1.8"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>);
const IconBuilding=(p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}><rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.8"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M4 19h16" strokeWidth="1.8"/></svg>);

export default function AdminShell() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // NUEVO estado de navegación y búsqueda
  const [nav, setNav] = useState("beneficios");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(""); setLoading(true);
        const list = await BeneficioApi.list();
        if (!alive) return;
        setItems(Array.isArray(list) ? list : []);
      } catch {
        setErr("No se pudieron cargar los beneficios.");
      } finally { alive && setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  async function handleSave(dto){
    try{
      setErr("");
      if (editing) {
        await BeneficioApi.update(editing.id, dto);
        const fresh = await BeneficioApi.get(editing.id);
        setItems(s => s.map(x => x.id === editing.id ? fresh : x));
      } else {
        const id = await BeneficioApi.create(dto);
        const fresh = typeof id === "string" ? await BeneficioApi.get(id) : id;
        setItems(s => [fresh, ...s]);
      }
      setShowForm(false); setEditing(null);
    }catch{ setErr("No se pudo guardar."); }
  }

  // Filtro por texto (para header)
  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return items;
    return items.filter(b => {
      const hay = [b.titulo, b.proveedorNombre, b.categoriaNombre].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  // Ítems del menú móvil
  const mobileItems = [
    { key:"beneficios",  label:"Beneficios",  icon:<IconGift className="w-5 h-5"/>,     level:0 },
    { key:"categorias",  label:"Categorías",  icon:<IconTag className="w-5 h-5"/>,      level:1 },
    { key:"proveedores", label:"Proveedores", icon:<IconBuilding className="w-5 h-5"/>, level:1 },
    { key:"hrportal",    label:"HR Portal",   icon:<IconBuilding className="w-5 h-5"/>, level:0 },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <HeaderBar
        nav={nav}
        setShowMobileNav={setShowMobileNav}
        query={query}
        setQuery={setQuery}
        IconMenu={IconMenu}
        IconSearch={IconSearch}
      />

      {/* Contenido */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Shell</h2>

        {err && <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/[0.08] text-red-200 px-3 py-2">{err}</div>}
        {loading && <div className="mb-3 text-white/70">Cargando...</div>}

        {nav === "beneficios" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CardNew onClick={() => { setEditing(null); setShowForm(true); }} />
            {filtered.map(it => (
              <CardBeneficio
                key={it.id}
                item={it}
                onEdit={() => { setEditing(it); setShowForm(true); }}
                onDelete={async () => {
                  if (!confirm("¿Eliminar?")) return;
                  try { await BeneficioApi.remove(it.id); setItems(s => s.filter(x => x.id !== it.id)); }
                  catch { setErr("No se pudo eliminar."); }
                }}
              />
            ))}
          </div>
        )}

        {nav !== "beneficios" && (
          <div className="text-white/70">Sección “{nav}” próximamente…</div>
        )}
      </div>

      {/* Overlay sidebar móvil */}
      <MobileSidebar
        open={showMobileNav}
        current={nav}
        items={mobileItems}
        onSelect={(key) => {
          if (key === "hrportal") { setShowMobileNav(false); window.location.assign("/hrportal/"); return; }
          setNav(key);
          setShowMobileNav(false);
        }}
        onClose={() => setShowMobileNav(false)}
      />

      {/* Formulario */}
      {showForm && (
        <FullForm
          initial={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
