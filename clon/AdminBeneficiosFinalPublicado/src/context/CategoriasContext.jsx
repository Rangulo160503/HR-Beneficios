import { createContext, useContext, useEffect, useState } from "react";
import { CategoriaApi } from "../services/adminApi";

const CategoriasContext = createContext();

export function CategoriasProvider({ children }) {
  const [cats, setCats] = useState([]);

  // cargar al inicio
  useEffect(() => {
    (async () => {
      try {
        const data = await CategoriaApi.list();
        setCats(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    })();
  }, []);

  return (
    <CategoriasContext.Provider value={{ cats, setCats }}>
      {children}
    </CategoriasContext.Provider>
  );
}

export function useCategorias() {
  return useContext(CategoriasContext);
}
