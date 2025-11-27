import { NAV_ITEMS } from "./constants";
import AdminBeneficiosPage from "@/components/AdminPages/AdminBeneficiosPage";
import AdminCategoriasPage from "@/components/AdminPages/AdminCategoriasPage";
import AdminProveedoresPage from "@/components/AdminPages/AdminProveedoresPage";

export default function AdminMain(props) {
  const { nav } = props;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="pt-4 px-4 md:px-6 space-y-4">
        {nav === NAV_ITEMS.BENEFICIOS && <AdminBeneficiosPage {...props} />}
        {nav === NAV_ITEMS.CATEGORIAS && <AdminCategoriasPage {...props} />}
        {nav === NAV_ITEMS.PROVEEDORES && <AdminProveedoresPage {...props} />}
      </div>
    </main>
  );
}
