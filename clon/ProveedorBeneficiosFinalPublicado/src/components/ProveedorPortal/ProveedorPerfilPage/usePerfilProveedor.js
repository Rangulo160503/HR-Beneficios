// src/pages/ProveedorPortal/ProveedorPerfilPage/usePerfilProveedor.js

import useProveedorPerfil from "./useProveedorPerfil";

export default function usePerfilProveedor() {
  const { perfil, loading, error, savePerfil, reload } = useProveedorPerfil();
  return { perfil, loading, error, savePerfil, reload };
}
