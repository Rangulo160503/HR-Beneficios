// src/components/Display/useDisplayData.js
import { useEffect, useState } from "react";
import { Api } from "../../services/api";
import { mapBenefit, mapCategoria, mapProveedor } from "../../utils/mappers";

export function useDisplayData() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        setError("");
        setLoading(true);
        setLoadingFilters(true);

        const [beneficios, cats, provs] = await Promise.all([
          Api.beneficios.listar({ signal: ctrl.signal }).catch(() => []),
          Api.categorias.listar({ signal: ctrl.signal }).catch(() => []),
          Api.proveedores.listar({ signal: ctrl.signal }).catch(() => []),
        ]);

        const first = Array.isArray(beneficios) ? beneficios[0] : null;
        if (first) {
          console.log("beneficios sample (0):", first);
          const keys = Object.keys(first);
          console.log("campos presentes:", keys);
          const hasImg = ["imagenBase64","ImagenBase64","imagenUrl","ImagenUrl","imagen","Imagen","imagenThumb","ImagenThumb"]
            .some((k) => first[k] != null && first[k] !== "");
          console.log("¿La lista trae algún campo de imagen?", hasImg);
        }

        setItems(Array.isArray(beneficios) ? beneficios.map(mapBenefit) : []);
        setCategorias(Array.isArray(cats) ? cats.map(mapCategoria) : []);
        setProveedores(Array.isArray(provs) ? provs.map(mapProveedor) : []);
      } catch (e) {
        if (e?.name !== "AbortError") {
          console.error(e);
          setError("No se pudieron cargar los datos.");
          setItems([]);
          setCategorias([]);
          setProveedores([]);
        }
      } finally {
        setLoading(false);
        setLoadingFilters(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  return {
    items, categorias, proveedores,
    loading, loadingFilters, error, setError,
  };
}
