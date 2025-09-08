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

  // Debounce para no recalcular en cada tecla
  const q = useDebounce(busqueda, 250);

  // Modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Infinite scroll (client-side reveal)
  const PAGE = 18;                           // cards por “página”
  const [visible, setVisible] = useState(PAGE);
  const loadMoreRef = useRef(null);

  const openDetail = (id) => { setSelectedId(id); setDetailOpen(true); };
  const closeDetail = () => { setDetailOpen(false); setSelectedId(null); };

  // Bloquea scroll del body cuando hay modal
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
      setItems(Array.isArray(b) ? b : []);
      // cachea si no había
      if (!CACHED_CATS && Array.isArray(cMaybe)) { CACHED_CATS = cMaybe; }
      if (!CACHED_PROVS && Array.isArray(pMaybe)) { CACHED_PROVS = pMaybe; }
      setCategorias(CACHED_CATS || []);
      setProveedores(CACHED_PROVS || []);
    } catch (e) {
      console.error(e);
      setItems([]);
      setError("No se pudieron cargar los beneficios.");
    } finally {
      setLoading(false);
      setVisible(PAGE); // reset lote visible
    }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, []);

  // Filtrado + búsqueda + A–Z (memoizado)
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

  // Resetea “visible” cuando cambian filtros/búsqueda
  useEffect(() => { setVisible(PAGE); }, [q, filtroCategoria, filtroProveedor, letra]);

  // IntersectionObserver para cargar más
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

  // Lista que se muestra (lote)
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
                    imagen: it.imagenUrl ?? it.ImagenUrl,
                  }}
                  onClick={() =>
                    openDetail(it.beneficioId ?? it.BeneficioId ?? it.id ?? it.Id)
                  }
                />
              ))}
        </div>

        {/* Sentinela para el infinite scroll */}
        {!loading && filtrados.length > visible && (
          <div ref={loadMoreRef} className="h-10 w-full" />
        )}

        {/* Empty state */}
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
