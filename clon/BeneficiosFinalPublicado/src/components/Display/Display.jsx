// src/components/Display/Display.jsx
import { useEffect, useRef, useState } from "react";
import BenefitDetailModal from "../modal/BenefitDetailModal";
import FormModal from "../FormModal";
import DisplayHeader from "./DisplayHeader";
import DisplayFilters from "./DisplayFilters";
import BenefitsGrid from "./BenefitsGrid";
import { useDisplayData } from "./useDisplayData";
import { useHeaderScroll } from "./useHeaderScroll";
import { useFilteredBenefits } from "./useFilteredBenefits";

export default function Display() {
  const [busqueda, setBusqueda] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const { items, categorias, proveedores, loading, loadingFilters, error } =
    useDisplayData();

  const [catSel, setCatSel] = useState(null);
  const [provSel, setProvSel] = useState(null);

  const { headerY, scrolled } = useHeaderScroll();

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

  const { filtered } = useFilteredBenefits({
    items,
    categorias,
    proveedores,
    busqueda,
    catSel,
    provSel,
  });

  const [selected, setSelected] = useState(null);
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [selected]);

  const [formOpen, setFormOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFormOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <DisplayHeader
        headerRef={headerRef}
        headerY={headerY}
        scrolled={scrolled}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        setFormOpen={setFormOpen}
        categoriasLen={categorias.length}
        proveedoresLen={proveedores.length}
      />

      {/* filtros */}
      <div style={{ height: headerH }} />
      <div className="fixed left-0 right-0 z-30 mt-[56px] sm:mt-[64px] bg-black/80 backdrop-blur">
        <DisplayFilters
          loadingFilters={loadingFilters}
          categorias={categorias}
          proveedores={proveedores}
          catSel={catSel}
          setCatSel={setCatSel}
          provSel={provSel}
          setProvSel={setProvSel}
        />
      </div>

      {/* Spacer extra por filtros */}
      <div style={{ height: headerH + 88 }} />

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-4">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
            <button className="ml-3 underline" onClick={() => location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        <BenefitsGrid
          loading={loading}
          filtered={filtered}
          error={error}
          onSelectBenefit={setSelected}
        />

        <div className="h-32" />
      </div>

      {selected && (
        <BenefitDetailModal selected={selected} onClose={() => setSelected(null)} />
      )}

      <FormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        postUrl={`${import.meta.env.VITE_API_URL}/api/Contacto`}
        onSubmitted={(resp) => console.log("Contacto enviado:", resp)}
      />

      {!formOpen && (
        <button
          onClick={() => setFormOpen(true)}
          aria-label="Contacto"
          className="sm:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-cyan-600 shadow-lg shadow-cyan-900/30 hover:bg-cyan-500 active:scale-95 transition"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            className="mx-auto h-7 w-7 text-white">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
      )}
    </div>
  );
}
