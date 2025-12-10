import { useCallback, useEffect, useState } from "react";
import AprobacionesApi from "../services/adminApi";

function useAprobaciones() {
  const [pendientes, setPendientes] = useState([]);
  const [aprobados, setAprobados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("pendientes");
  const [editandoId, setEditandoId] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [pend, apr] = await Promise.all([
        AprobacionesApi.pendientes(),
        AprobacionesApi.aprobados(),
      ]);

      setPendientes(pend || []);
      setAprobados(apr || []);

      setSeleccionado((actual) => {
        const listaPend = pend || [];
        const listaApr = apr || [];
        if (actual) {
          const encontrado = [...listaPend, ...listaApr].find(
            (b) => b?.beneficioId === actual?.beneficioId
          );
          if (encontrado) return encontrado;
        }
        if (listaPend.length > 0) return listaPend[0];
        if (listaApr.length > 0) return listaApr[0];
        return null;
      });
    } catch (err) {
      console.error("[Aprobaciones] Error al cargar", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const aprobar = async (id) => {
    await AprobacionesApi.aprobar(id);
    setPendientes((prev) => {
      const moved = prev.find((b) => b.beneficioId === id);
      const restantes = prev.filter((b) => b.beneficioId !== id);
      if (moved) {
        setAprobados((apr) => [moved, ...apr]);
      }
      setSeleccionado((actual) => {
        if (actual?.beneficioId === id) {
          return restantes[0] || null;
        }
        return actual;
      });
      return restantes;
    });
  };

  const rechazar = async (id) => {
    await AprobacionesApi.rechazar(id);
    setPendientes((prev) => {
      const restantes = prev.filter((b) => b.beneficioId !== id);
      setSeleccionado((actual) => {
        if (actual?.beneficioId === id) {
          return restantes[0] || null;
        }
        return actual;
      });
      return restantes;
    });
  };

  const toggleDisponible = async (id, disponible) => {
    await AprobacionesApi.toggleDisponible(id, disponible);
    setAprobados((prev) =>
      prev.map((b) =>
        b.beneficioId === id
          ? {
              ...b,
              disponible,
            }
          : b
      )
    );
    setSeleccionado((actual) =>
      actual?.beneficioId === id ? { ...actual, disponible } : actual
    );
  };

  const abrirEdicion = (id) => setEditandoId(id);
  const cerrarEdicion = () => setEditandoId(null);

  return {
    pendientes,
    aprobados,
    seleccionado,
    loading,
    tab,
    setTab,
    seleccionar: setSeleccionado,
    aprobar,
    rechazar,
    toggleDisponible,
    recargar: cargar,
    editandoId,
    abrirEdicion,
    cerrarEdicion,
  };
}

export default useAprobaciones;