import { useEffect, useRef, useState } from "react";
import BenefitCard, { BenefitCardSkeleton } from "./BenefitCard";
import { Api } from "../services/api";

/* ========= HScroll (ligero, interno a este archivo) ========= */
function HScroll({ children, className = "", maskWidth = 32 }) {
  const ref = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;

    const onScroll = () => update();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Convierte rueda vertical a horizontal cuando hay overflow
  const onWheel = (e) => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth) return;
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      el.scrollBy({ left: e.deltaY, behavior: "auto" });
      e.preventDefault();
    }
  };

  return (
    <div className={`relative ${className}`} onWheel={onWheel}>
      {canLeft && (
        <div
          className="pointer-events-none absolute left-0 top-0 h-full"
          style={{
            width: maskWidth,
            background: "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0))",
          }}
        />
      )}

      <div
        ref={ref}
        className="
    flex gap-2 overflow-x-auto no-scrollbar
    py-2 whitespace-nowrap px-1
    cursor-grab select-none
    overscroll-x-contain
  "
        style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>

      {canRight && (
        <div
          className="pointer-events-none absolute right-0 top-0 h-full"
          style={{
            width: maskWidth,
            background: "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))",
          }}
        />
      )}
    </div>
  );
}

/* ========= Utils ========= */
function normalizeImage(img) {
  if (!img) return "";
  if (typeof img === "string") {
    const s = img.trim();
    if (!s) return "";
    if (
      s.startsWith("http://") ||
      s.startsWith("https://") ||
      s.startsWith("data:") ||
      s.startsWith("blob:")
    )
      return s;
    const looksB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
    if (looksB64) return `data:image/jpeg;base64,${s.replace(/\s/g, "")}`;
    if (s.startsWith("/")) return s;
    return s;
  }
  if (Array.isArray(img)) {
    try {
      const u = new Uint8Array(img);
      let bin = "";
      for (let i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]);
      return `data:image/jpeg;base64,${btoa(bin)}`;
    } catch {
      return "";
    }
  }
  return "";
}

function mapBenefit(b) {
  const id = b.beneficioId ?? b.BeneficioId ?? b.id ?? b.Id;
  const titulo = b.titulo ?? b.Titulo ?? b.nombre ?? b.Nombre ?? "Beneficio";
  const proveedor =
    b.proveedorNombre ?? b.ProveedorNombre ?? b.proveedor ?? b.Proveedor ?? "Proveedor";
  const categoria = b.categoriaNombre ?? b.CategoriaNombre ?? b.categoria ?? b.Categoria ?? null;

  let descuento = b.descuento ?? b.Descuento ?? b.porcentaje ?? b.Porcentaje ?? null;
  if (typeof descuento === "number")
    descuento = `${descuento > 0 ? "-" : ""}${Math.abs(descuento)}%`;
  if (typeof descuento === "string" && descuento && !descuento.includes("%"))
    descuento = `${descuento}%`;

  const destacado = !!(b.destacado ?? b.Destacado);

  const rawImg =
    b.imagenThumb ??
    b.ImagenThumb ??
    b.imagenUrl ??
    b.ImagenUrl ??
    b.imagen ??
    b.Imagen ??
    null;

  return {
    id,
    titulo,
    proveedor,
    categoria,
    descuento: descuento || null,
    destacado,
    imagen: normalizeImage(rawImg),
  };
}

function mapCategoria(c) {
  return {
    id: c.categoriaId ?? c.CategoriaId ?? c.id ?? c.Id,
    nombre: c.nombre ?? c.Nombre ?? c.titulo ?? c.Titulo ?? "Categoría",
  };
}
function mapProveedor(p) {
  return {
    id: p.proveedorId ?? p.ProveedorId ?? p.id ?? p.Id,
    nombre: p.nombre ?? p.Nombre ?? p.titulo ?? p.Titulo ?? "Proveedor",
  };
}

/* ========= Componente ========= */
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
      (x.categoria && String(catSel) === String(x.categoriaId ?? x.categoria?.id ?? x.categoria));
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

  /* --- Chips UI usando HScroll --- */
  const ChipsRow = ({ items, selected, onSelect, allLabel }) => (
    <HScroll className="py-1">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-sm border snap-start
          ${selected == null ? "bg-white text-black border-white" : "bg-white/10 text-white border-white/10 hover:bg-white/15"}`}
      >
        {allLabel}
      </button>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onSelect(it.id)}
          className={`px-3 py-1.5 rounded-full text-sm border snap-start
            ${String(selected) === String(it.id)
              ? "bg-white text-black border-white"
              : "bg-white/10 text-white border-white/10 hover:bg-white/15"}`}
        >
          {it.nombre}
        </button>
      ))}
    </HScroll>
  );

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
          <span className="text-cyan-500 font-bold text-xl">Beneficios</span>
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
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-white/10" />
            <div className="h-7 w-7 rounded bg-white/10" />
            <div className="h-7 w-7 rounded bg-white/10" />
          </div>
        </div>

        {/* Móvil */}
        <div className="sm:hidden">
          {!searchOpen ? (
            <div className="h-14 px-4 flex items-center justify-between">
              <span className="text-cyan-500 font-bold text-xl">Beneficios</span>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 h-6 w-6 rounded" />
                <div className="bg-white/10 h-6 w-6 rounded" />
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
                  {...(window.innerWidth > 640 ? { autoFocus: true } : {})}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar beneficios..."
                  className="flex-1 h-9 rounded-xl bg-white/10 border border-white/10 px-3 text-base placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* FILTROS: Categorías y Proveedores */}
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
              <ChipsRow
                items={categorias}
                selected={catSel}
                onSelect={setCatSel}
                allLabel="Todas las categorías"
              />
            )}
            {/* Proveedores */}
            {loadingFilters ? (
              <div className="py-2 flex gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-7 w-24 rounded-full bg-white/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <ChipsRow
                items={proveedores}
                selected={provSel}
                onSelect={setProvSel}
                allLabel="Todos los proveedores"
              />
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
            ? Array.from({ length: 12 }).map((_, i) => <BenefitCardSkeleton key={i} />)
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-base font-semibold">{selected.titulo}</h3>
              <button
                onClick={() => setSelected(null)}
                className="h-8 w-8 rounded bg-white/10 hover:bg-white/15"
                aria-label="Cerrar"
              />
            </div>
            <div className="p-4 space-y-3">
              <div className="w-full aspect-[16/9] rounded-xl bg-white/10 overflow-hidden">
                {selected.imagen ? (
                  <img src={selected.imagen} alt={selected.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full grid place-items-center text-white/60 text-sm">Sin imagen</div>
                )}
              </div>
              <div className="text-sm text-white/80">
                <div className="text-white/60">Proveedor</div>
                <div className="font-medium">{selected.proveedor}</div>
              </div>
              {selected.descuento && (
                <span className="inline-block px-2 py-1 rounded bg-emerald-500 text-black text-xs font-semibold">
                  {selected.descuento}
                </span>
              )}
              <p className="text-sm text-white/70">
                Aquí irá la descripción del beneficio, condiciones, vigencia, etc.
              </p>
            </div>
            <div className="px-4 py-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/15 text-sm"
              >
                Cerrar
              </button>
              <button className="px-3 py-2 rounded bg-white text-black text-sm font-semibold">
                Solicitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
