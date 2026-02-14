// src/components/ProveedorPortal/ProveedorPerfilPage/useProveedorPerfil.js

import { useEffect, useState } from "react";
import { loadProveedoresList, updateProveedor } from "../../../core-config/useCases";

export default function useProveedorPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      // 🔹 Por ahora: tomamos el PRIMER proveedor que devuelva la API
      // (luego, cuando tengas usuario logueado, aquí usarás el proveedorId del usuario)
      const data = await loadProveedoresList();
      const first = Array.isArray(data) && data.length ? data[0] : null;
      setPerfil(first);
    } catch (err) {
      console.error("Error cargando perfil proveedor:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function savePerfil(model) {
    try {
      setLoading(true);
      setError(null);

      // Intentamos usar el id que venga en el modelo, o el del perfil actual
      const id = model.id || perfil?.id;
      if (!id) {
        throw new Error("No se encontró el Id del proveedor para actualizar.");
      }

      const actualizado = await updateProveedor({ proveedorId: id, dto: model });
      setPerfil(actualizado);
    } catch (err) {
      console.error("Error guardando perfil proveedor:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    perfil,
    loading,
    error,
    savePerfil,
    reload: load,
  };
}
