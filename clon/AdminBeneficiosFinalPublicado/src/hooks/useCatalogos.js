import { useEffect, useState } from "react";
import { CategoriaApi, ProveedorApi } from "../services/adminApi";

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
        const [C, P] = await Promise.all([CategoriaApi.list(), ProveedorApi.list()]);
        if (!alive) return;
        setCats(Array.isArray(C) ? C : []);
        setProvs(Array.isArray(P) ? P : []);
      } catch { setErr("No se pudieron cargar catálogos."); }
      finally { alive && setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  // CRUD Categoría
  async function addCategoria() {
  const v = prompt("Nueva categoría (nombre)");
  if (!v) return;

  const idOrObj = await CategoriaApi.create({ nombre: v.trim() });
  const created = typeof idOrObj === "string" ? await CategoriaApi.get(idOrObj) : idOrObj;

  setCats(s => [created, ...s]);
  return created;
}


  async function renameCategoria(r) {
    const nuevo = prompt("Renombrar categoría", r.nombre ?? ""); if (!nuevo) return;
    await CategoriaApi.update(r.id, { nombre: nuevo.trim(), activa: r.activa ?? true });
    const fresh = await CategoriaApi.get(r.id);
    setCats(s => s.map(x => (x.id === r.id ? fresh : x)));
  }

  async function deleteCategoria(r) {
    if (!confirm("¿Eliminar categoría?")) return;
    await CategoriaApi.remove(r.id);
    setCats(s => s.filter(x => x.id !== r.id));
  }

  // CRUD Proveedor
  async function addProveedor() {
    const v = prompt("Nuevo proveedor (nombre)"); if (!v) return;
    const idOrObj = await ProveedorApi.create({ nombre: v.trim() });
    const created = typeof idOrObj === "string" ? await ProveedorApi.get(idOrObj) : idOrObj;
    setProvs(s => [created, ...s]);
    return created;
  }
  async function renameProveedor(r) {
    const nom = prompt("Renombrar proveedor", r.nombre ?? ""); if (!nom) return;
    const id = r.id ?? r.proveedorId;
    await ProveedorApi.update(id, { nombre: nom.trim() });
    const fresh = await ProveedorApi.get(id);
    setProvs(s => s.map(x => String(x.id) === String(r.id) ? fresh : x));
  }
  async function deleteProveedor(r) {
    if (!confirm("¿Eliminar proveedor?")) return;
    const id = r.id ?? r.proveedorId;
    await ProveedorApi.remove(id);
    setProvs(s => s.filter(x => String(x.id) !== String(id)));
  }

  return {
    cats, provs, loading, err,
    addCategoria, renameCategoria, deleteCategoria,
    addProveedor, renameProveedor, deleteProveedor,
  };
}
