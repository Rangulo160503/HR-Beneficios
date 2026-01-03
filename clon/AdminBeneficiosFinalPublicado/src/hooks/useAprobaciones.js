// src/hooks/useAprobaciones.js
import { useEffect, useMemo, useState } from "react";
import { BeneficioApi } from "../services/adminApi";

const mapBenefitId = (r) => {
  const id =
    r?.id ??
    r?.Id ??
    r?.beneficioId ??
    r?.BeneficioId ??
    r?.beneficio?.id ??
    r?.beneficio?.Id;

  const fixed = String(id ?? "").trim();
  return {
    ...r,
    id: fixed || undefined,
    beneficioId: fixed || undefined,
  };
};

export function useAprobaciones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const refresh = async () => {
    try {
      setLoading(true);
      setError("");
      const raw = await BeneficioApi.pending();
      const list = Array.isArray(raw) ? raw.map(mapBenefitId) : [];
      setItems(list);
      if (list.length > 0) {
        setSelectedId((prev) => (list.some((b) => b.id === prev) ? prev : list[0].id));
      } else {
        setSelectedId("");
      }
    } catch (err) {
      console.error("No se pudieron cargar los pendientes", err);
      setError("No se pudieron cargar los pendientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const selected = useMemo(() => items.find((b) => b.id === selectedId) || null, [items, selectedId]);

  const aprobar = async (id) => {
    if (!id) return;
    await BeneficioApi.approve(id);
    await refresh();
  };

  const rechazar = async (id, motivo) => {
    if (!id) return;
    const body = motivo ? { motivo } : {};
    await BeneficioApi.reject(id, body);
    await refresh();
  };

  return {
    items,
    loading,
    error,
    selected,
    selectedId,
    setSelectedId,
    refresh,
    aprobar,
    rechazar,
  };
}