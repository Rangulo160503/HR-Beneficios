import { useEffect, useMemo, useRef, useState } from "react";
import { BeneficioApi, CategoriaApi, ProveedorApi } from "@/services/adminApi";

const cls = (...a) => a.filter(Boolean).join(" ");
const normId = (v) => (v == null ? "" : String(v).trim());
const lower  = (v) => normId(v).toLowerCase();

const LS_SIDEBAR = "admin.sidebar.collapsed";

export default function AdminShell() {

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="p-6 text-white/60">
        <em>AdminShell.jsx listo para pegar tu contenido.</em>
      </div>
    </div>
  );
}
