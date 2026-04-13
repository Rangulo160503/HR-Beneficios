import { NAV_ITEMS } from "./constants";
import DashboardBeneficios from "../beneficios/pages/DashboardBeneficios";
import CategoriasPage from "../categorias/pages/CategoriasPage";
import ProveedoresPage from "../proveedores/pages/ProveedoresPage";
import AprobacionesPage from "../aprobaciones/pages/AprobacionesPage";
import InfoBoardPage from "../infoboard/pages/InfoBoardPage";
import CategoriaEnUsoModal from "../categorias/modals/CategoriaEnUsoModal";
import { useCategoriaReasignacion } from "../categorias/hooks/useCategoriaReasignacion";

export default function DashboardMain(props) {
  const {
    nav,
    setNav,
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
    showForm,
    setShowForm,
    editing,
    setEditing
  } = props;

  const { handleReasignar, handleEditFromModal } = useCategoriaReasignacion({
    cats,
    accionesBeneficios,
    setCategoriaEnUso,
    setShowCategoriaEnUso,
    setNav,
    navBeneficiosKey: NAV_ITEMS.BENEFICIOS,
    setEditing,
    setShowForm
  });

  return <main className="flex-1 overflow-y-auto">
      <div className="pt-4 px-4 md:px-6 space-y-4">
        
        {nav === NAV_ITEMS.BENEFICIOS && <DashboardBeneficios state={state} benefits={beneficios} accionesBeneficios={accionesBeneficios} cats={cats} provs={provs} addCategoria={addCategoria} addProveedor={addProveedor} showForm={showForm} setShowForm={setShowForm} editing={editing} setEditing={setEditing} categoriaEnUso={categoriaEnUso} showCategoriaEnUso={showCategoriaEnUso} setCategoriaEnUso={setCategoriaEnUso} setShowCategoriaEnUso={setShowCategoriaEnUso} />}

        
        {nav === NAV_ITEMS.CATEGORIAS && <CategoriasPage cats={cats} addCategoria={addCategoria} renameCategoria={renameCategoria} deleteCategoria={deleteCategoria} categoriaEnUso={categoriaEnUso} showCategoriaEnUso={showCategoriaEnUso} setCategoriaEnUso={setCategoriaEnUso} setShowCategoriaEnUso={setShowCategoriaEnUso} />}

        
        {nav === NAV_ITEMS.PROVEEDORES && <ProveedoresPage provs={provs} addProveedor={addProveedor} renameProveedor={renameProveedor} deleteProveedor={deleteProveedor} onProveedorUpdated={upsertProveedorLocal} />}

        {nav === NAV_ITEMS.INFOBOARD && <InfoBoardPage />}
        {nav === NAV_ITEMS.APROBACIONES && <AprobacionesPage />}
      </div>

      <CategoriaEnUsoModal open={Boolean(showCategoriaEnUso)} categoria={categoriaEnUso} cats={cats} onClose={() => {
      setShowCategoriaEnUso(false);
      setCategoriaEnUso(null);
    }} onReasignar={handleReasignar} onEditBenefit={handleEditFromModal} />
    </main>;
}
