// src/components/ProveedorPortal/ProveedorSidebar.jsx

// ICONOS estilo admin
const IconBenefit = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="3" y="7" width="18" height="14" rx="2" strokeWidth="1.8" />
    <path d="M3 11h18M12 7v14" strokeWidth="1.8" />
    <circle cx="12" cy="5" r="2.5" strokeWidth="1.8" />
  </svg>
);

const IconUser = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
    <path
      d="M4 20c0-4 3.5-7 8-7s8 3 8 7"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconHelp = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
    <path
      d="M9.75 9.75a2.25 2.25 0 1 1 3.07 2.07c-.69.28-1.07.97-1.07 1.68v.5"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

// 👉 exportamos los items para poder reutilizarlos en el sidebar móvil
export const proveedorNavItems = [
  { id: "beneficios", label: "Beneficios", icon: IconBenefit },
  { id: "perfil", label: "Perfil", icon: IconUser },
  { id: "ayuda", label: "Ayuda", icon: IconHelp },
];

export default function ProveedorSidebar({ activeSection, onChangeSection }) {
  return (
    <aside className="w-60 bg-neutral-950 border-r border-white/10 hidden md:flex flex-col sticky top-0 h-screen">
      <div className="h-14 md:h-16 flex items-center px-4">
        <span className="font-semibold text-white/70">Portal proveedor</span>
      </div>

      <nav className="p-2 flex-1 space-y-1">
        {proveedorNavItems.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          const classes =
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition " +
            (active
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:bg-neutral-900 hover:text-white");

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChangeSection(id)}
              className={classes}
            >
              <Icon
                className={
                  "w-5 h-5 " +
                  (active ? "text-emerald-400" : "text-neutral-500")
                }
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-3 text-xs text-neutral-600">Proveedor</div>
    </aside>
  );
}
