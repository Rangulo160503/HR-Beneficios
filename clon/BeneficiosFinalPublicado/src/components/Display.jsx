import { useEffect, useMemo, useRef, useState } from "react";
import { Api } from "../services/api.js";
import BenefitCard from "./BenefitCard";
import Modal from "./Modal";
import BenefitDetailModal from "./modal/BenefitDetailModal";
import SearchBar from "./SearchBar";
import FilterChips from "./FilterChips";
import AlphabetBar from "./AlphabetBar";

// ====== Cache simple en memoria (proceso) ======
let CACHED_CATS = null;
let CACHED_PROVS = null;

// ====== Hook de debounce ======
function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/5 p-2">
      <div className="aspect-square w-full rounded-xl animate-pulse bg-white/10" />
      <div className="mt-2 space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

/** ====== Utils de imagen ====== */
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#1f2937'/>
          <stop offset='100%' stop-color='#374151'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <g fill='#9CA3AF' font-size='42' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>
        <text x='50%' y='50%'>Sin imagen</text>
      </g>
    </svg>`
  );

/** Normaliza formatos del API a un src usable */
function normalizeImage(img) {
  if (!img) return PLACEHOLDER;

  if (typeof img === "string") {
    const s = img.trim();
    if (!s) return PLACEHOLDER;
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("blob:"))
      return s;
    const looksLikeB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
    if (looksLikeB64) return `data:image/jpeg;base64,${s.replace(/\s/g, "")}`;
    if (s.startsWith("/")) return s;
    return s;
  }

  if (Array.isArray(img)) {
    try {
      const uint = new Uint8Array(img);
      let binary = "";
      for (let i = 0; i < uint.length; i++) binary += String.fromCharCode(uint[i]);
      const b64 = btoa(binary);
      return `data:image/jpeg;base64,${b64}`;
    } catch {
      return PLACEHOLDER;
    }
  }
  return PLACEHOLDER;
}

export default function Display() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState(CACHED_CATS || []);
  const [proveedores, setProveedores] = useState(CACHED_PROVS || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros / búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [filtroProveedor, setFiltroProveedor] = useState(null);
  const [letra, setLetra] = useState("");

  const q = useDebounce(busqueda, 250);

  // Modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Infinite scroll (client-side reveal)
  const PAGE = 18;
  const [visible, setVisible] = useState(PAGE);
  const loadMoreRef = useRef(null);

  const openDetail = (id) => { setSelectedId(id); setDetailOpen(true); };
  const closeDetail = () => { setDetailOpen(false); setSelectedId(null); };

  // Bloquea scroll cuando hay modal
  useEffect(() => {
    document.body.style.overflow = detailOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [detailOpen]);

  // Carga inicial (beneficios + cat/prov con cache)
  const cargar = async () => {
    try {
      setError("");
      setLoading(true);
      const [b, cMaybe, pMaybe] = await Promise.all([
        Api.beneficios.listar(),
        categorias?.length ? Promise.resolve(categorias) : Api.categorias.listar(),
        proveedores?.length ? Promise.resolve(proveedores) : Api.proveedores.listar(),
      ]);

      // Mapeo + normalización de imagen (acepta imagen|Imagen|imagenUrl|ImagenUrl|imagenThumb)
      const mapped = (Array.isArray(b) ? b : []).map((it) => {
        const raw =
          it.imagenThumb ?? it.ImagenThumb ??
          it.imagen ?? it.Imagen ??
          it.imagenUrl ?? it.ImagenUrl ?? null;

        return {
          ...it,
          _imgNorm: normalizeImage(raw),
          _hasRealImg: !!raw, // ← bandera para lazy-load en BenefitCard
        };
      });

      setItems(mapped);

      if (!CACHED_CATS && Array.isArray(cMaybe)) CACHED_CATS = cMaybe;
      if (!CACHED_PROVS && Array.isArray(pMaybe)) CACHED_PROVS = pMaybe;
      setCategorias(CACHED_CATS || []);
      setProveedores(CACHED_PROVS || []);
    } catch (e) {
      console.error(e);
      setItems([]);
      setError("No se pudieron cargar los beneficios.");
    } finally {
      setLoading(false);
      setVisible(PAGE);
    }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, []);

  // Filtrado + búsqueda + A–Z
  const filtrados = useMemo(() => {
    const qLower = (q || "").toLowerCase();
    return items.filter((x) => {
      const titulo = x.titulo ?? x.Titulo ?? "";
      const proveedor = x.proveedorNombre ?? x.ProveedorNombre ?? "";
      const matchBusqueda =
        !qLower ||
        titulo.toLowerCase().includes(qLower) ||
        proveedor.toLowerCase().includes(qLower);

      const matchCategoria =
        !filtroCategoria ||
        String(x.categoriaId ?? x.CategoriaId) === String(filtroCategoria);

      const matchProveedor =
        !filtroProveedor ||
        String(x.proveedorId ?? x.ProveedorId) === String(filtroProveedor);

      const inicialTitulo = titulo?.[0]?.toUpperCase?.() || "";
      const inicialProv = proveedor?.[0]?.toUpperCase?.() || "";
      const matchLetra = !letra || inicialTitulo === letra || inicialProv === letra;

      return matchBusqueda && matchCategoria && matchProveedor && matchLetra;
    });
  }, [items, q, filtroCategoria, filtroProveedor, letra]);

  useEffect(() => { setVisible(PAGE); }, [q, filtroCategoria, filtroProveedor, letra]);

  // IntersectionObserver para revelar más
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (loading) return;

    const el = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisible((v) => {
            if (v >= filtrados.length) return v;
            return Math.min(v + PAGE, filtrados.length);
          });
        }
      },
      { rootMargin: "180px 0px" }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [filtrados.length, loading]);

  const toShow = loading ? [] : filtrados.slice(0, visible);

  return (
    <main className="flex-1 bg-neutral-900 text-white">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-4">
        <SearchBar value={busqueda} onChange={setBusqueda} />
        <AlphabetBar value={letra} onChange={setLetra} />

        <FilterChips
          items={categorias}
          selected={filtroCategoria}
          onSelect={setFiltroCategoria}
          allLabel="Todas las categorías"
        />

        <FilterChips
          items={proveedores}
          selected={filtroProveedor}
          onSelect={setFiltroProveedor}
          allLabel="Todos los proveedores"
        />

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
            <button className="ml-3 underline underline-offset-2" onClick={cargar}>
              Reintentar
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : toShow.map((it) => (
                <BenefitCard
                  key={it.beneficioId ?? it.BeneficioId ?? it.id ?? it.Id}
                  item={{
                    id: it.beneficioId ?? it.BeneficioId ?? it.id ?? it.Id,
                    titulo: it.titulo ?? it.Titulo,
                    proveedor: it.proveedorNombre ?? it.ProveedorNombre,
                    imagen: it._imgNorm,        // puede ser real o placeholder
                    hasRealImg: it._hasRealImg, // ← para decidir lazy-load
                  }}
                  onClick={() =>
                    openDetail(it.beneficioId ?? it.BeneficioId ?? it.id ?? it.Id)
                  }
                />
              ))}
        </div>

        {!loading && filtrados.length > visible && (
          <div ref={loadMoreRef} className="h-10 w-full" />
        )}

        {!loading && !filtrados.length && !error && (
          <div className="mt-8 text-center text-white/60">
            No hay beneficios para mostrar.
          </div>
        )}
      </div>

      <Modal open={detailOpen} title="Detalle del beneficio" onClose={closeDetail}>
        {selectedId && <BenefitDetailModal beneficioId={selectedId} />}
      </Modal>
    </main>
  );
}
