import { useEffect, useMemo, useState } from "react";
import { BeneficioApi } from "../services/adminApi";

const norm  = v => (v == null ? "" : String(v).trim());
const lower = v => norm(v).toLowerCase();

export function useBeneficios() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [query, setQuery]   = useState("");
  const [selCat, setSelCat] = useState("");
  const [selProv, setSelProv] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(""); setLoading(true);
        const list = await BeneficioApi.list();
        if (!alive) return;
        setItems(Array.isArray(list) ? list : []);
      } catch { setErr("No se pudieron cargar los beneficios."); }
      finally { alive && setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  function matchCat(b) {
    if (!selCat) return true;
    const id = lower(b.categoriaId ?? b.categoria?.id);
    return id && id === lower(selCat);
  }
  function matchProv(b) {
    if (!selProv) return true;
    const id = lower(b.proveedorId ?? b.proveedor?.id);
    return id && id === lower(selProv);
  }

  const filtered = useMemo(() => {
    const q = lower(query);
    return items
      .filter(b => matchCat(b) && matchProv(b))
      .filter(b => {
        if (!q) return true;
        const hay = [b.titulo, b.proveedorNombre, b.categoriaNombre]
          .filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      });
  }, [items, query, selCat, selProv]);

  async function save(dto, editing) {
    if (editing) {
      await BeneficioApi.update(editing.id, dto);
      const fresh = await BeneficioApi.get(editing.id);
      setItems(s => s.map(x => x.id === editing.id ? fresh : x));
    } else {
      const id = await BeneficioApi.create(dto);
      const fresh = typeof id === "string" ? await BeneficioApi.get(id) : id;
      setItems(s => [fresh, ...s]);
    }
  }
  async function remove(id) {
    await BeneficioApi.remove(id);
    setItems(s => s.filter(x => x.id !== id));
  }

  // chips visibles
  const visibleCats = useMemo(() => {
    const seen = new Map();
    for (const b of items) {
      const id = norm(b.categoriaId ?? b.categoria?.id);
      const label = norm(b.categoriaNombre ?? b.categoria?.nombre ?? b.categoria?.titulo);
      if (id && label && !seen.has(id)) seen.set(id, label);
    }
    return Array.from(seen, ([id, label]) => ({ id, label }))
      .sort((a,b)=>a.label.localeCompare(b.label, "es", { sensitivity:"base" }));
  }, [items]);

  const visibleProvs = useMemo(() => {
    const seen = new Map();
    for (const b of items) {
      const id = norm(b.proveedorId ?? b.proveedor?.id);
      const label = norm(b.proveedorNombre ?? b.proveedor?.nombre);
      if (id && label && !seen.has(id)) seen.set(id, label);
    }
    return Array.from(seen, ([id, label]) => ({ id, label }))
      .sort((a,b)=>a.label.localeCompare(b.label, "es", { sensitivity:"base" }));
  }, [items]);

  return {
    state: { items, filtered, loading, err, query, selCat, selProv, visibleCats, visibleProvs },
    actions: { setQuery, setSelCat, setSelProv, save, remove, setItems },
  };
}
