// src/components/ProveedorPortal/ProveedorHeader.jsx
import { LocalSessionStore } from "../../core/infrastructure/session/LocalSessionStore";

const LS_PROV_SIDEBAR = "hr-prov-sidebar-collapsed";
const sidebarStore = new LocalSessionStore(LS_PROV_SIDEBAR);

export default function ProveedorHeader({
  collapsed,
  onToggleCollapsed,
  setShowMobileNav,
}) {
  return (
    <header className="h-14 md:h-16 flex items-center px-4 border-b border-white/10 gap-4">

      {/* botón menú solo en móvil */}
      <button className="md:hidden" onClick={() => setShowMobileNav(true)}>
        ☰
      </button>

      {/* botón colapsar / expandir — igual al admin */}
      <button
        onClick={() => {
          const next = !collapsed;
          sidebarStore.setSession(next ? "1" : "0");
          onToggleCollapsed(next);
        }}
        className="font-semibold text-white/60 hover:text-white text-sm"
        title={collapsed ? "Expandir" : "Colapsar"}
      >
        {collapsed ? "Prov" : "Portal proveedor"}
      </button>
    </header>
  );
}
