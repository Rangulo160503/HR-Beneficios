import { useEffect, useState } from "react";
import { CategoriaApi, ProveedorApi } from "../services/adminApi";

// helpers arriba del hook
const norm   = (v) => (v == null ? "" : String(v).trim());
const normId = (v) => (v == null ? "" : String(v).trim());
const getCatId  = (r) => normId(
  r?.id ?? r?.Id ?? r?.categoriaId ?? r?.CategoriaId ??
  r?.categoriaID ?? r?.CategoriaID ?? r?.idCategoria ?? r?.IdCategoria ??
  r?.categoria?.id ?? r?.categoria?.Id
);
const getProvId = (p) => normId(p?.id ?? p?.proveedorId ?? p?.ProveedorId ?? p?.ID);

const dedupeById = (arr, getId) => {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const id = getId(it);
    if (id && !seen.has(id)) { seen.add(id); out.push(it); }
  }
  return out;
};



export function useCatalogos() {
  const [cats, setCats]   = useState([]);
  const [provs, setProvs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(""); setLoading(true);
        const [Craw, Praw] = await Promise.all([CategoriaApi.list(), ProveedorApi.list()]);
        if (!alive) return;

        // Normaliza categorías
        const C0 = Array.isArray(Craw) ? Craw : [];
        const C1 = C0
          .map(c => {
            const id = getCatId(c);
            const titulo = norm(c?.titulo ?? c?.nombre ?? c?.Titulo ?? c?.Nombre);
            if (!id || !titulo) return null;
            return { ...c, id, categoriaId: id, titulo, nombre: c?.nombre ?? titulo };
          })
          .filter(Boolean);
        const C = dedupeById(C1, getCatId);

        // Normaliza proveedores
        const P0 = Array.isArray(Praw) ? Praw : [];
        const P1 = P0
          .map(p => {
            const id = getProvId(p);
            const nombre = norm(p?.nombre ?? p?.Nombre ?? p?.titulo ?? p?.Titulo);
            if (!id || !nombre) return null;
            return { ...p, id, proveedorId: id, nombre };
          })
          .filter(Boolean);
        const P = dedupeById(P1, getProvId);

        setCats(C);
        setProvs(P);
      } catch {
        setErr("No se pudieron cargar catálogos.");
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // ===== CRUD Categoría =====
  // src/hooks/useCatalogos.js
// dentro del hook, sustituye addCategoria por esto:
async function addCategoria(nombrePrompt) {
  const v = nombrePrompt ?? prompt("Nueva categoría (nombre)");
  const nombre = norm(v);
  if (!nombre) return;

  // 1) crear
  const idOrObj = await CategoriaApi.create({ nombre });

  // 2) intentar obtener un id confiable
  const maybeId = typeof idOrObj === "string" ? idOrObj : getCatId(idOrObj);

  // 3) hidratar desde GET si tenemos id; si no, usa la respuesta
  let createdRaw = maybeId ? await CategoriaApi.get(maybeId) : idOrObj;

  // 4) normalizar el nodo que guardaremos en estado (con id SIEMPRE)
  const nodo = (() => {
    const rid = getCatId(createdRaw) || normId(maybeId);
    const nom = norm(createdRaw?.nombre ?? createdRaw?.titulo ?? nombre);
    return {
      ...createdRaw,
      id: rid,
      categoriaId: rid,
      nombre: nom,
      titulo: createdRaw?.titulo ?? nom,
    };
  })();

  // 5) actualizar estado sin duplicar
  setCats((s) => dedupeById([nodo, ...s], getCatId));

  // 6) devolver el creado (con id) para que FullForm lo seleccione
  return nodo;
}


// helpers arriba del archivo (o al inicio):
const getCatId = (r) => {
  const v = r?.id ?? r?.Id ?? r?.categoriaId ?? r?.CategoriaId ??
            r?.categoriaID ?? r?.CategoriaID ?? r?.idCategoria ?? r?.IdCategoria ??
            r?.categoria?.id ?? r?.categoria?.Id;
  return v == null ? "" : String(v);
};

  async function renameCategoria(r) {
    const id = getCatId(r);
    const nuevo = prompt("Renombrar categoría", r?.titulo ?? r?.nombre ?? "");
    const titulo = norm(nuevo);
    if (!id || !titulo) return;

    await CategoriaApi.update(id, { titulo, activa: r?.activa ?? true });
    const fresh = await CategoriaApi.get(id);

    const nodo = {
      ...r,
      ...fresh,
      id,
      categoriaId: id,
      titulo: norm(fresh?.titulo ?? titulo),
      nombre: norm(fresh?.nombre ?? fresh?.titulo ?? titulo),
    };

    setCats(s => s.map(x => (getCatId(x) === id ? nodo : x)));
  }

  async function deleteCategoria(r) {
    const id = getCatId(r);
    if (!id) return;
    if (!confirm("¿Eliminar categoría?")) return;
    await CategoriaApi.remove(id);
    setCats(s => s.filter(x => getCatId(x) !== id));
  }

  // ===== CRUD Proveedor =====
  async function addProveedor(nombrePrompt) {
    const v = nombrePrompt ?? prompt("Nuevo proveedor (nombre)");
    const nombre = norm(v);
    if (!nombre) return;

    const idOrObj = await ProveedorApi.create({ nombre });
    const id = typeof idOrObj === "string" ? idOrObj : getProvId(idOrObj);
    const createdRaw = id ? await ProveedorApi.get(id) : idOrObj;

    const nodo = (() => {
      const rid = getProvId(createdRaw) || normId(id);
      const nom = norm(createdRaw?.nombre ?? nombre);
      return { ...createdRaw, id: rid, proveedorId: rid, nombre: nom };
    })();

    setProvs(s => dedupeById([nodo, ...s], getProvId));
    return nodo;
  }

  async function renameProveedor(r) {
    const id = getProvId(r);
    const nom = prompt("Renombrar proveedor", r?.nombre ?? "");
    const nombre = norm(nom);
    if (!id || !nombre) return;

    await ProveedorApi.update(id, { nombre });
    const fresh = await ProveedorApi.get(id);

    const nodo = {
      ...r,
      ...fresh,
      id,
      proveedorId: id,
      nombre: norm(fresh?.nombre ?? nombre),
    };

    setProvs(s => s.map(x => (getProvId(x) === id ? nodo : x)));
  }

  async function deleteProveedor(r) {
    const id = getProvId(r);
    if (!id) return;
    if (!confirm("¿Eliminar proveedor?")) return;
    await ProveedorApi.remove(id);
    setProvs(s => s.filter(x => getProvId(x) !== id));
  }

  return {
    cats, provs, loading, err,
    addCategoria, renameCategoria, deleteCategoria,
    addProveedor, renameProveedor, deleteProveedor,
  };
}
