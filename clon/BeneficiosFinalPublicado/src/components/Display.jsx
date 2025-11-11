// src/components/Display.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import BenefitCard from "./BenefitCard";
import ChipsRow from "./ChipsRow";
import { Api } from "../services/api";
import { mapBenefit, mapCategoria, mapProveedor } from "../utils/mappers";
import BenefitDetailModal from "./modal/BenefitDetailModal";
import HScroll from "./HScroll";
import FormModal from "./FormModal";


/* ========= Fuzzy Search helpers ========= */
const SP_SYNONYMS = {
  // odontología
  "dentista": ["odontologo","odontóloga","odontologia","odontología","doctor dental","doctora dental"],
  "limpieza": ["profilaxis","higiene","higienizacion","higienización"],
  "extraccion": ["extracción","sacar diente","quitar muela","exodoncia"],
  "caries": ["cavidad","empaste","resina","obturacion","obturación","relleno"],
  "frenillos": ["brackets","ortodoncia"],
  "placa": ["ferula","férula","bruxismo","guarda"],
  "blanqueamiento": ["aclarado","aclaramiento"],
  // precios / promos
  "combo": ["paquete","promocion","promoción","oferta"],
  // comunes
  "consulta": ["cita","valoración","valoracion","evaluacion","evaluación","diagnostico","diagnóstico"],
};

function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // quitar tildes
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // quitar signos
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s = "") {
  return normalize(s).split(" ").filter(Boolean);
}

/** Levenshtein simple para tolerar 1-2 errores */
function editDistance(a, b) {
  a = normalize(a); b = normalize(b);
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  const dp = Array.from({length: m+1}, (_, i) =>
    Array.from({length: n+1}, (_, j) => (i===0 ? j : j===0 ? i : 0))
  );
  for (let i=1;i<=m;i++){
    for (let j=1;j<=n;j++){
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i-1][j] + 1,
        dp[i][j-1] + 1,
        dp[i-1][j-1] + cost
      );
    }
  }
  return dp[m][n];
}

/** Expande tokens con sinónimos (ES) */
function expandWithSynonyms(tokens) {
  const out = new Set(tokens);
  for (const t of tokens) {
    const key = normalize(t);
    if (SP_SYNONYMS[key]) {
      for (const s of SP_SYNONYMS[key]) out.add(s);
    }
    for (const [base, list] of Object.entries(SP_SYNONYMS)) {
      if (list.some(x => normalize(x) === key)) out.add(base);
    }
  }
  return Array.from(out);
}

/** Scoring: substring > prefix > distancia Levenshtein <=2 */
function tokenMatchesField(token, field) {
  if (!field) return 0;
  const f = normalize(field);
  const t = normalize(token);
  if (!t || !f) return 0;
  if (f.includes(t)) return 3;               // substring fuerte
  if (f.startsWith(t)) return 2;             // prefijo
  const d = editDistance(t, f.slice(0, Math.min(f.length, t.length + 2)));
  if (d <= 1) return 2;
  if (d === 2) return 1;
  return 0;
}

/** Puntúa un ítem con base en varios campos */
function scoreItem(item, qTokens) {
  if (!qTokens.length) return 1;
  const catName = item.categoriaNombre || item.categoria?.nombre || item.categoria?.titulo;
  const provName = item.proveedorNombre || item.proveedor?.nombre || item.proveedor;
  const fields = [
    item.titulo, item.descripcion, item.condiciones,
    catName, provName
  ].filter(Boolean);

  let score = 0;
  for (const tk of qTokens) {
    let best = 0;
    for (const field of fields) {
      best = Math.max(best, tokenMatchesField(tk, field));
      if (best === 3) break;
    }
    score += best;
  }
  return score;
}

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

  /* --- Fetch inicial: beneficios + categorías + proveedores --- */
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setError("");
        setLoading(true);
        setLoadingFilters(true);

        const [beneficios, cats, provs] = await Promise.all([
          Api.beneficios.listar({ signal: ctrl.signal }).catch(() => []),
          Api.categorias.listar({ signal: ctrl.signal }).catch(() => []),
          Api.proveedores.listar({ signal: ctrl.signal }).catch(() => []),
        ]);

        // Logs defensivos (opcionales)
        const first = Array.isArray(beneficios) ? beneficios[0] : null;
        if (first) {
          console.log("beneficios sample (0):", first);
          const keys = Object.keys(first);
          console.log("campos presentes:", keys);
          const hasImg = ["imagenBase64","ImagenBase64","imagenUrl","ImagenUrl","imagen","Imagen","imagenThumb","ImagenThumb"]
            .some((k) => first[k] != null && first[k] !== "");
          console.log("¿La lista trae algún campo de imagen?", hasImg);
        }

        setItems(Array.isArray(beneficios) ? beneficios.map(mapBenefit) : []);
        setCategorias(Array.isArray(cats) ? cats.map(mapCategoria) : []);
        setProveedores(Array.isArray(provs) ? provs.map(mapProveedor) : []);
      } catch (e) {
        if (e?.name !== "AbortError") {
          console.error(e);
          setError("No se pudieron cargar los datos.");
          setItems([]);
          setCategorias([]);
          setProveedores([]);
        }
      } finally {
        setLoading(false);
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
  const [formOpen, setFormOpen] = useState(false);
useEffect(() => {
  const t = setTimeout(() => setFormOpen(true), 1500);
  return () => clearTimeout(t);
}, []);

  /* --- Index pre-normalizado para speedups --- */
  const indexed = useMemo(() => {
    return items.map((it) => ({
      ...it,
      _index: normalize(
        [
          it.titulo,
          it.descripcion,
          it.condiciones,
          it.proveedorNombre || it.proveedor,
          it.categoriaNombre || it.categoria?.nombre || it.categoria?.titulo
        ].filter(Boolean).join(" ")
      )
    }));
  }, [items]);

  /* --- Búsqueda + Filtros (fuzzy + sinónimos) --- */
  const q = busqueda.trim();
  const qTokensBase = useMemo(() => tokenize(q), [q]);
  const qTokens = useMemo(() => expandWithSynonyms(qTokensBase), [qTokensBase]);

  const filtered = useMemo(() => {
    const source = indexed.length ? indexed : items;

    return source
      .filter((x) => {
        // === Filtro por categoría ===
        const byCatId = !catSel || String(x.categoriaId ?? x.categoria?.id ?? x.categoria) === String(catSel);
        const catNameSel = categorias.find((c) => String(c.id) === String(catSel));
        const byCatName =
          !catSel ||
          String(x.categoriaNombre || x.categoria || "").toLowerCase() ===
            String((catNameSel?.nombre || catNameSel?.titulo || "")).toLowerCase();
        const matchCategoria = !catSel || byCatId || byCatName;

        // === Filtro por proveedor ===
        const byProvId = !provSel || String(x.proveedorId ?? x.proveedor?.id ?? x.proveedor) === String(provSel);
        const provNameSel = proveedores.find((p) => String(p.id) === String(provSel));
        const byProvName =
          !provSel ||
          String(x.proveedorNombre || x.proveedor || "").toLowerCase() ===
            String((provNameSel?.nombre || "")).toLowerCase();
        const matchProveedor = byProvId || byProvName;

        if (!matchCategoria || !matchProveedor) return false;

        // === Búsqueda difusa ===
        if (!qTokens.length) return true; // sin texto: pasa por chips

        // Atajo: si el índice pre-normalizado incluye todo el query como substring
        const haySubstr = (x._index || "").includes(normalize(q));
        if (haySubstr) return true;

        // Scoring por tokens
        const s = scoreItem(x, qTokens);
        const minScore = Math.max(2, Math.ceil(qTokens.length * 1.5)); // umbral configurable
        return s >= minScore;
      })
      .sort((a, b) => {
        if (!qTokens.length) return 0;
        const sa = scoreItem(a, qTokens);
        const sb = scoreItem(b, qTokens);
        return sb - sa;
      });
  }, [indexed, items, catSel, provSel, categorias, proveedores, qTokens, q]);

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

        {/* Botón Contacto (solo desktop) */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setFormOpen(true)}
            className="hidden sm:inline-flex h-9 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10 transition"
          >
            Contacto
          </button>
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
                className="p-1 rounded-full hover:bg-white/20 transition"
                aria-label="Abrir búsqueda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(false)}
                className="shrink-0 p-2 rounded-full hover:bg-white/20 transition"
                aria-label="Cerrar búsqueda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-white"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <input
                {...(typeof window !== "undefined" && window.innerWidth > 640 ? { autoFocus: true } : {})}
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
      <div className="w-full py-2">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 px-1 -mx-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={`cat-skel-${i}`}
              aria-hidden="true"
              className={[
                // ⬇️ AJUSTA ESTA ALTURA para igualar la de tus chips reales (h-9 u h-10)
                "h-9 rounded-full bg-white/5 border border-white/10 animate-pulse",
                // anchos variados para simular chips
                i % 4 === 0 ? "w-20" : i % 4 === 1 ? "w-24" : i % 4 === 2 ? "w-28" : "w-32",
              ].join(" ")}
            />
          ))}
        </div>
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
      <div className="w-full py-2">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 px-1 -mx-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={`prov-skel-${i}`}
              aria-hidden="true"
              className={[
                // ⬇️ AJUSTA ESTA ALTURA para igualar la de tus chips reales (h-9 u h-10)
                "h-9 rounded-full bg-white/5 border border-white/10 animate-pulse",
                i % 4 === 0 ? "w-20" : i % 4 === 1 ? "w-24" : i % 4 === 2 ? "w-28" : "w-32",
              ].join(" ")}
            />
          ))}
        </div>
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
        {loading ? (
  // 🦴 Skeletons mientras se cargan los beneficios
  Array.from({ length: 12 }).map((_, i) => (
    <div
      key={`skeleton-${i}`}
      className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3 animate-pulse"
    >
      {/* Imagen simulada */}
      <div className="h-40 w-full rounded-xl bg-white/10" />

      {/* Espacio para texto */}
      <div className="mt-3 h-4 w-3/4 rounded bg-white/10" />
      <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
      <div className="mt-4 h-3 w-2/3 rounded bg-white/10" />
    </div>
  ))
) : (
  filtered.map((it) => (
    <BenefitCard key={it.id} item={it} onClick={() => setSelected(it)} />
  ))
)}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div className="mt-8 text-center text-white/60">No se encontraron beneficios.</div>
      )}

      <div className="h-32" />
    </div>

    {/* ======= MODAL DETALLE ======= */}
    {selected && (
      <BenefitDetailModal selected={selected} onClose={() => setSelected(null)} />
    )}

    {/* ======= FORMULARIO DE CONTACTO ======= */}
    <FormModal
      isOpen={formOpen}
      onClose={() => setFormOpen(false)}
      postUrl={`${import.meta.env.VITE_API_URL}/api/Contacto`}
      onSubmitted={(resp) => console.log("Contacto enviado:", resp)}
    />

    {/* FAB de Contacto — solo móvil */}
    {!formOpen && (
      <button
        onClick={() => setFormOpen(true)}
        aria-label="Contacto"
        className="sm:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-cyan-600 shadow-lg shadow-cyan-900/30 hover:bg-cyan-500 active:scale-95 transition"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto h-7 w-7 text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
    )}
  </div>
);
}