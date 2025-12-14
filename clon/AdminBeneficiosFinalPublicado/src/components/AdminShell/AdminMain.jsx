// src/components/AdminShell/AdminMain.jsx
import { NAV_ITEMS } from "./constants";

import DashboardBeneficios from "./pages/DashboardBeneficios";
import CategoriasPage from "./pages/CategoriasPage";
import ProveedoresPage from "./pages/ProveedoresPage";
import AprobacionesPage from "./pages/AprobacionesPage";
import InfoBoardPage from "./pages/InfoBoardPage";

export default function AdminMain(props) {
  const {
    nav,
    state,
    beneficios,
    accionesBeneficios,
    cats,
    provs,
    addCategoria,
    addProveedor,
    showForm,
    setShowForm,
    editing,
    setEditing,
  } = props;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="pt-4 px-4 md:px-6 space-y-4">
        {/* BENEFICIOS (DASHBOARD) */}
        {nav === NAV_ITEMS.BENEFICIOS && (
          <DashboardBeneficios
            state={state}
            benefits={beneficios}
            accionesBeneficios={accionesBeneficios}
            cats={cats}
            provs={provs}
            addCategoria={addCategoria}
            addProveedor={addProveedor}
            showForm={showForm}
            setShowForm={setShowForm}
            editing={editing}
            setEditing={setEditing}
          />
        )}

        {/* CATEGORÍAS */}
        {nav === NAV_ITEMS.CATEGORIAS && (
          <CategoriasPage
            cats={cats}
            addCategoria={addCategoria}
          />
        )}

        {/* PROVEEDORES */}
        {nav === NAV_ITEMS.PROVEEDORES && (
          <ProveedoresPage
            provs={provs}
            addProveedor={addProveedor}
          />
        )}
        {nav === NAV_ITEMS.INFOBOARD && <InfoBoardPage />}
        {nav === NAV_ITEMS.APROBACIONES && (
          <AprobacionesPage />
        )}
      </div>
    </main>
  );
}
