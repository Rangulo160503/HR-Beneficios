// src/components/AdminShell/hooks/useAprobaciones.js
import { useEffect, useState } from "react";
import { AprobacionesApi } from "../services/adminApi";

const mapId = (b) => ({
  ...b,
  beneficioId:
    b?.beneficioId ?? b?.BeneficioId ?? b?.id ?? b?.Id ?? b?.beneficio?.id,
});

export default function useAprobaciones() {
  const [pendientes, setPendientes] = useState([]);
  const [aprobados, setAprobados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("pendientes");
  const [editandoId, setEditandoId] = useState(null);

  async function cargar() {
    try {
      setLoading(true);
      const [rawPendientes, rawAprobados] = await Promise.all([
        AprobacionesApi.pendientes(),
        AprobacionesApi.aprobados(),
      ]);

      const nuevosPendientes = Array.isArray(rawPendientes)
        ? rawPendientes.map(mapId)
        : [];
      const nuevosAprobados = Array.isArray(rawAprobados)
        ? rawAprobados.map(mapId)
        : [];

      setPendientes(nuevosPendientes);
      setAprobados(nuevosAprobados);

      if (!seleccionado && nuevosPendientes.length > 0) {
        setSeleccionado(nuevosPendientes[0]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function aprobar(id) {
    await AprobacionesApi.aprobar(id);
    setPendientes((prev) => {
      const restante = prev.filter((b) => b.beneficioId !== id);
      const aprobado = prev.find((b) => b.beneficioId === id);
      if (aprobado) {
        setAprobados((prevAprobados) => [aprobado, ...prevAprobados]);
      }

      if (seleccionado?.beneficioId === id) {
        setSeleccionado(restante[0] ?? null);
      }
      return restante;
    });
  }

  async function rechazar(id) {
    await AprobacionesApi.rechazar(id);
    setPendientes((prev) => {
      const restante = prev.filter((b) => b.beneficioId !== id);
      if (seleccionado?.beneficioId === id) {
        setSeleccionado(restante[0] ?? null);
      }
      return restante;
    });
  }

  async function toggleDisponible(id, disponible) {
    await AprobacionesApi.toggleDisponible(id, disponible);
    setAprobados((prev) =>
      prev.map((b) =>
        b.beneficioId === id ? { ...b, disponible } : b
      )
    );
    if (seleccionado?.beneficioId === id) {
      setSeleccionado((prev) => ({ ...prev, disponible }));
    }
  }

  const abrirEdicion = (id) => setEditandoId(id);
  const cerrarEdicion = () => setEditandoId(null);

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    const listaActual = tab === "pendientes" ? pendientes : aprobados;
    if (!listaActual.find((b) => b.beneficioId === seleccionado?.beneficioId)) {
      setSeleccionado(listaActual[0] ?? null);
    }
  }, [tab, pendientes, aprobados]);

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