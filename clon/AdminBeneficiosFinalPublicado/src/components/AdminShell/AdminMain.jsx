// src/components/AdminShell/AdminMain.jsx
import { NAV_ITEMS } from "./constants";

import DashboardBeneficios from "./pages/DashboardBeneficios";
import CategoriasPage from "./pages/CategoriasPage";
import ProveedoresPage from "./pages/ProveedoresPage";
import AprobacionesPage from "./pages/AprobacionesPage";
import InfoBoardPage from "./pages/InfoBoardPage";
import CategoriaEnUsoModal from "./modals/CategoriaEnUsoModal";
import { BeneficioApi } from "../../services/adminApi";

const normId = (v) => (v == null ? "" : String(v).trim());
const getCatId = (r) =>
  normId(
    r?.id ??
      r?.Id ??
      r?.categoriaId ??
      r?.CategoriaId ??
      r?.categoriaID ??
      r?.CategoriaID ??
      r?.idCategoria ??
      r?.IdCategoria ??
      r?.categoria?.id ??
      r?.categoria?.Id
  );

export default function AdminMain(props) {
  const {
    nav,
    state,
    beneficios,
    accionesBeneficios,
    cats,
    provs,
    categoriaEnUso,
    showCategoriaEnUso,
    setCategoriaEnUso,
    setShowCategoriaEnUso,

    addCategoria,
    renameCategoria,
    deleteCategoria,

    addProveedor,
    renameProveedor,
    deleteProveedor,

    upsertProveedorLocal,
  } = props;

  const handleReasignar = async ({ fromCategoriaId, toCategoriaId, beneficioIds }) => {
    const fromId = normId(fromCategoriaId);
    const toId = normId(toCategoriaId);
    await BeneficioApi.reassignCategoria({
      fromCategoriaId: fromId,
      toCategoriaId: toId,
      beneficioIds,
    });

    const destino = cats.find((c) => getCatId(c) === toId);
    const destinoNombre = destino?.nombre ?? destino?.titulo;

    accionesBeneficios?.setItems?.((prev = []) => {
      return prev.map((b) => {
        const bId = normId(b?.beneficioId ?? b?.id);
        const matchByList = Array.isArray(beneficioIds) && beneficioIds.length > 0
          ? beneficioIds.includes(bId)
          : normId(b?.categoriaId ?? b?.CategoriaId ?? b?.categoria?.id) === fromId;
        if (!matchByList) return b;
        return {
          ...b,
          categoriaId: toId,
          categoriaNombre: destinoNombre ?? b.categoriaNombre,
        };
      });
    });

    setCategoriaEnUso(null);
    setShowCategoriaEnUso(false);
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="pt-4 px-4 md:px-6 space-y-4">
        {/* BENEFICIOS (DASHBOARD) */}
        {nav === NAV_ITEMS.BENEFICIOS && (
          <DashboardBeneficios
            state={state}
            benefits={beneficios}
            accionesBeneficios={accionesBeneficios}
            categoriaEnUso={categoriaEnUso}
            showCategoriaEnUso={showCategoriaEnUso}
            setCategoriaEnUso={setCategoriaEnUso}
            setShowCategoriaEnUso={setShowCategoriaEnUso}
          />
        )}

        {/* CATEGORÍAS */}
        {nav === NAV_ITEMS.CATEGORIAS && (
  <CategoriasPage
    cats={cats}
    addCategoria={addCategoria}
            renameCategoria={renameCategoria}
            deleteCategoria={deleteCategoria}
            categoriaEnUso={categoriaEnUso}
            showCategoriaEnUso={showCategoriaEnUso}
            setCategoriaEnUso={setCategoriaEnUso}
            setShowCategoriaEnUso={setShowCategoriaEnUso}
          />
        )}

        {/* PROVEEDORES */}
        {nav === NAV_ITEMS.PROVEEDORES && (
          <ProveedoresPage
            provs={provs}
            addProveedor={addProveedor}
            renameProveedor={renameProveedor}
            deleteProveedor={deleteProveedor}
            onProveedorUpdated={upsertProveedorLocal}
          />
        )}

        {nav === NAV_ITEMS.INFOBOARD && <InfoBoardPage />}
        {nav === NAV_ITEMS.APROBACIONES && <AprobacionesPage />}
      </div>

      <CategoriaEnUsoModal
        open={Boolean(showCategoriaEnUso)}
        categoria={categoriaEnUso}
        cats={cats}
        onClose={() => {
          setShowCategoriaEnUso(false);
          setCategoriaEnUso(null);
        }}
        onReasignar={handleReasignar}
      />
    </main>
  );
}
