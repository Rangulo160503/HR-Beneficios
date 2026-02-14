// src/components/sidebar/Sidebar.jsx
import NavItem from "./NavItem";
import { LocalSessionStore } from "../../core/infrastructure/session/LocalSessionStore";

const IconGift = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="1.8" />
    <path d="M12 8v13M3 12h18" strokeWidth="1.8" />
  </svg>
);

const IconTag = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path
      d="M20 13.5 10.5 4H5v5.5L14.5 19a2.1 2.1 0 0 0 3 0L20 16.5a2.1 2.1 0 0 0 0-3z"
      strokeWidth="1.8"
    />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);

const IconBuilding = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.8" />
    <path
      d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M4 19h16"
      strokeWidth="1.8"
    />
  </svg>
);

const IconHandshake = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path
      d="M3 12l3-3 3 3 3-3 3 3 3-3 3 3"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12v5a2 2 0 0 0 2 2h2m12-7v5a2 2 0 0 1-2 2h-2"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconShield = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" strokeWidth="1.8" />
    <path d="m9 12 2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBoard = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="4" y="5" width="16" height="14" rx="2" strokeWidth="1.8" />
    <path d="M8 9h8M8 13h5" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LS_SIDEBAR = "admin.sidebar.collapsed";
const sidebarStore = new LocalSessionStore(LS_SIDEBAR);

export default function Sidebar({
  nav,
  onChangeNav,
  collapsed,
  onToggleCollapsed,
}) {
  return (
    <aside className="bg-neutral-950 border-r border-white/10 hidden md:flex flex-col sticky top-0 h-screen">
      <div className="h-14 md:h-16 flex items-center px-4">
        <button
          onClick={() => {
            const next = !collapsed;
            sidebarStore.setSession(next ? "1" : "0");
            onToggleCollapsed(next);
          }}
          className="font-semibold text-white/60 hover:text-white"
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? "HR" : "HR Beneficios"}
        </button>
      </div>

      <nav className="p-2 flex-1 space-y-1">
        <NavItem
          label="Beneficios"
          icon={<IconGift className="w-5 h-5" />}
          active={nav === "beneficios"}
          collapsed={collapsed}
          onClick={() => onChangeNav("beneficios")}
        />

        <NavItem
          label="Categorías"
          icon={<IconTag className="w-5 h-5" />}
          active={nav === "categorias"}
          collapsed={collapsed}
          onClick={() => onChangeNav("categorias")}
        />

        <NavItem
          label="Proveedores"
          icon={<IconHandshake className="w-5 h-5" />}
          active={nav === "proveedores"}
          collapsed={collapsed}
          onClick={() => onChangeNav("proveedores")}
        />

        <NavItem
          label="InfoBoard"
          icon={<IconBoard className="w-5 h-5" />}
          active={nav === "infoboard"}
          collapsed={collapsed}
          onClick={() => onChangeNav("infoboard")}
        />

        {/* 
<a
  href="http://hrportal"
  target="_blank"
  rel="noopener noreferrer"
  className="block"
>
  <NavItem
    label="HR Portal"
    icon={<IconBuilding className="w-5 h-5" />}
    active={nav === "hrportal"}
    collapsed={collapsed}
  />
</a>
*/}


        {/* Aprobaciones separado, sin estar dentro del <a> */}
        <NavItem
          label="Aprobaciones"
          icon={<IconShield className="w-5 h-5" />}
          active={nav === "aprobaciones"}
          collapsed={collapsed}
          onClick={() => onChangeNav("aprobaciones")}
        />
      </nav>
    </aside>
  );
}
