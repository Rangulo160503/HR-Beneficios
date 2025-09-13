// src/components/Display.jsx
import { useEffect, useRef, useState } from "react";
import BenefitCard from "./BenefitCard";
import ChipsRow from "./ChipsRow";
import { Api } from "../services/api";
import { mapBenefit, mapCategoria, mapProveedor } from "../utils/mappers";
import BenefitDetailModal from "./modal/BenefitDetailModal";
import HScroll from "./HScroll";

export default function Display() {
  /* --- UI header --- */
  const [busqueda, setBusqueda] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  /* --- Datos --- */
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState("");

  /* --- Filtros activos --- */
  const [catSel, setCatSel] = useState(null); // id o null
  const [provSel, setProvSel] = useState(null); // id o null

  /* --- Fetch beneficios --- */
useEffect(() => {
  const ctrl = new AbortController();
  (async () => {
    try {
      setError("");
      setLoading(true);

      const data = await Api.beneficios.listar({ signal: ctrl.signal });

      // Logs de verificación (seguros)
      const first = Array.isArray(data) ? data[0] : null;
      console.log("beneficios sample (0):", first);
      if (first) {
        const keys = Object.keys(first);
        console.log("campos presentes:", keys);
        const hasImg = ["imagenBase64","ImagenBase64","imagenUrl","ImagenUrl","imagen","Imagen","imagenThumb","ImagenThumb"]
          .some((k) => first[k] != null && first[k] !== "");
        console.log("¿La lista trae algún campo de imagen?", hasImg);
      }

      setItems(Array.isArray(data) ? data.map(mapBenefit) : []);
    } catch (e) {
      if (e?.name !== "AbortError") {
        console.error(e);
        setError("No se pudieron cargar los beneficios.");
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  })();
  return () => ctrl.abort();
}, []);


  /* --- Fetch categorías y proveedores (en paralelo) --- */
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoadingFilters(true);
        const [cats, provs] = await Promise.all([
          Api.categorias.listar({ signal: ctrl.signal }).catch(() => []),
          Api.proveedores.listar({ signal: ctrl.signal }).catch(() => []),
        ]);
        setCategorias(Array.isArray(cats) ? cats.map(mapCategoria) : []);
        setProveedores(Array.isArray(provs) ? provs.map(mapProveedor) : []);
      } catch (e) {
        if (e?.name !== "AbortError") console.error(e);
      } finally {
        setLoadingFilters(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  /* --- Header hide/peek --- */
  const H_MOBILE = 56; // h-14
  const H_DESK = 64; // h-16
  const [headerY, setHeaderY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const lastYRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastYRef.current;
      const delta = currentY - lastY;
      lastYRef.current = currentY;

      const HEADER_H = window.innerWidth >= 640 ? H_DESK : H_MOBILE;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setHeaderY((prev) => {
          let next = prev;
          if (delta > 0) next = Math.max(-HEADER_H, prev - Math.min(delta, HEADER_H));
          else if (delta < 0) next = Math.min(0, prev - Math.max(delta, -HEADER_H));
          if (currentY < 8) next = 0;
          return next;
        });
        setScrolled(currentY > 2);
      });
    };

    lastYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* --- Spacer dinámico bajo header --- */
  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);
  const measureHeader = () => setHeaderH(headerRef.current?.offsetHeight || 0);
  useEffect(() => {
    measureHeader();
    const onResize = () => measureHeader();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    measureHeader();
  }, [searchOpen, categorias.length, proveedores.length]);

  /* --- Modal detalle --- */
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  /* --- Búsqueda + Filtros --- */
  const q = busqueda.trim().toLowerCase();
  const filtered = items.filter((x) => {
    const bySearch =
      !q ||
      (x.titulo || "").toLowerCase().includes(q) ||
      (x.proveedor || "").toLowerCase().includes(q);

    const byCat =
      !catSel ||
      (x.categoria &&
        String(catSel) === String(x.categoriaId ?? x.categoria?.id ?? x.categoria));
    const byCatName =
      !catSel ||
      (x.categoria &&
        String(x.categoria).toLowerCase() ===
          String(
            (categorias.find((c) => String(c.id) === String(catSel))?.nombre || "").toLowerCase()
          ));

    const matchCategoria = !catSel || byCat || byCatName;

    const byProv =
      !provSel ||
      String(x.proveedorId ?? x.proveedor?.id ?? x.proveedor) === String(provSel) ||
      String(x.proveedor).toLowerCase() ===
        String(
          (proveedores.find((p) => String(p.id) === String(provSel))?.nombre || "").toLowerCase()
        );

    return bySearch && matchCategoria && byProv;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ======= HEADER UNIFICADO ======= */}
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 z-40 bg-black/80 backdrop-blur ${
          scrolled ? "border-b border-white/10" : "border-b border-transparent"
        }`}
        style={{ transform: `translateY(${headerY}px)`, willChange: "transform" }}
      >
        {/* Desktop */}
        <div className="hidden sm:flex mx-auto w-full max-w-7xl h-16 px-4 items-center gap-4">
          <span className="text-cian-500 font-bold text-xl">Beneficios</span>
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-xl">
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar beneficios..."
                className="w-full h-10 rounded-full bg-white/10 border border-white/10 px-4 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* Móvil */}
        <div className="sm:hidden">
          {!searchOpen ? (
            <div className="h-14 px-4 flex items-center justify-between">
              <span className="text-cian-500 font-bold text-xl">Beneficios</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="bg-white/10 h-6 w-6 rounded"
                  aria-label="Abrir búsqueda"
                />
              </div>
            </div>
          ) : (
            <div className="px-3 py-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="shrink-0 bg-white/10 h-9 w-9 rounded"
                  aria-label="Cerrar búsqueda"
                />
                <input
                  {...(typeof window !== "undefined" && window.innerWidth > 640
                    ? { autoFocus: true }
                    : {})}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar beneficios..."
                  className="flex-1 h-9 rounded-xl bg-white/10 border border-white/10 px-3 text-base placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* FILTROS */}
        <div className="border-t border-white/10">
          <div className="mx-auto w-full max-w-7xl px-4">
            {/* Categorías */}
            {loadingFilters ? (
              <div className="py-2 flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-7 w-20 rounded-full bg-white/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <HScroll>
                <ChipsRow
                  items={categorias}
                  selected={catSel}
                  onSelect={setCatSel}
                  allLabel="Todas las categorías"
                />
              </HScroll>
            )}
            {/* Proveedores */}
            {loadingFilters ? (
              <div className="py-2 flex gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-7 w-24 rounded-full bg-white/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <HScroll>
                <ChipsRow
                  items={proveedores}
                  selected={provSel}
                  onSelect={setProvSel}
                  allLabel="Todos los proveedores"
                />
              </HScroll>
            )}
          </div>
        </div>
      </header>

      {/* Spacer dinámico */}
      <div style={{ height: headerH }} />

      {/* ======= CONTENIDO ======= */}
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-4">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
            <button className="ml-3 underline" onClick={() => location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {loading
  ? <div className="text-center text-white/60">Cargando...</div>
  : filtered.map((it) => (
      <BenefitCard key={it.id} item={it} onClick={() => setSelected(it)} />
    ))}

        </div>

        {!loading && !error && filtered.length === 0 && (
          <div className="mt-8 text-center text-white/60">No se encontraron beneficios.</div>
        )}

        <div className="h-32" />
      </div>

      {/* ======= MODAL DETALLE (mock) ======= */}
      {selected && (
  <BenefitDetailModal
    selected={selected}
    onClose={() => setSelected(null)}
  />
)}
    </div>
  );
}
