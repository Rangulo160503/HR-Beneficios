// src/hooks/useBeneficioImagenes.js
import { useEffect, useState } from "react";
import { BeneficioImagenApi } from "../services/adminApi";

export function useBeneficioImagenes(beneficioId) {
  const [state, setState] = useState({
    items: [],
    loading: false,
    err: null,
  });

  useEffect(() => {
    // ⬅️ si no hay id, reseteamos y salimos
    if (!beneficioId) {
      setState({ items: [], loading: false, err: null });
      return;
    }

    let cancel = false;
    setState((s) => ({ ...s, loading: true, err: null }));

    BeneficioImagenApi.list(beneficioId)
      .then((data) => {
        if (cancel) return;
        setState({ items: data || [], loading: false, err: null });
      })
      .catch((err) => {
        if (cancel) return;
        setState((s) => ({ ...s, loading: false, err }));
      });

    return () => {
      cancel = true;
    };
  }, [beneficioId]);

  // ⬅️ importantísimo: siempre retornamos un objeto
  return state;
}
