import Sidebar from "@/components/sidebar/Sidebar";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

import useAdminShell from "./useAdminShell";
import AdminHeader from "./AdminHeader";
import AdminMain from "./AdminMain";

import { MOBILE_ITEMS } from "./constants";

export default function AdminShell() {
  const shell = useAdminShell();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">

      {/* Sidebar escritorio */}
      <Sidebar
        nav={shell.nav}
        onChangeNav={shell.setNav}
        collapsed={shell.collapsed}
        onToggleCollapsed={shell.setCollapsed}
      />

      <div className="flex-1 flex flex-col">

        {/* Header */}
        <AdminHeader
          nav={shell.nav}
          onOpenMobile={() => shell.setShowMobileNav(true)}
        />

        {/* Main */}
        <AdminMain {...shell} />

        {/* Sidebar móvil */}
        <MobileSidebar
          open={shell.showMobileNav}
          current={shell.nav}
          items={MOBILE_ITEMS}
          onSelect={(key) => {
            if (key === "hrportal") {
              window.open("http://hrportal", "_blank", "noopener,noreferrer");
              return;
            }
            shell.setNav(key);
          }}
          onClose={() => shell.setShowMobileNav(false)}
        />
      </div>
    </div>
  );
}
