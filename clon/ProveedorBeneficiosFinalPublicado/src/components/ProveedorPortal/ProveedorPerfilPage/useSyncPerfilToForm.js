// src/pages/ProveedorPortal/ProveedorPerfilPage/useSyncPerfilToForm.js

import { useEffect } from "react";

export default function useSyncPerfilToForm(perfil, setForm) {
  useEffect(() => {
    if (perfil) setForm(perfil);
  }, [perfil, setForm]);
}
