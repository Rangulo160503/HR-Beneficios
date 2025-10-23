// src/hooks/useBeneficios.js
import { useEffect, useMemo, useState } from "react";
import { BeneficioApi, CategoriaApi, ProveedorApi } from "../services/adminApi";

const norm   = v => (v == null ? "" : String(v).trim());
const lower  = v => norm(v).toLowerCase();
const normId = v => (v == null ? "" : String(v).trim());

const isMeaningful = (s) => {
  const v = String(s ?? "").trim();
  return v && v.length > 1 && !/^[-–—]+$/.test(v);
};

// helpers selección por nombre cuando no hay GUID estable
const isNameSel = (sel) => String(sel).startsWith("name:");
const nameOfSel = (sel) => String(sel).slice(5);

// 🔒 Normaliza un beneficio para garantizar id estable
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
    id: fixed || undefined,          // clave única para React
    beneficioId: fixed || undefined, // compatibilidad con código existente
  };
};

export function useBeneficios() {
  const [items, setItems]     = useState([]);
  const [cats, setCats]       = useState([]);
  const [provs, setProvs]     = useState([]);
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const [query, setQuery]       = useState("");
  const [selCat, setSelCat]     = useState("");
  const [selProv, setSelProv]   = useState("");

  // carga inicial de catálogos + beneficios
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(""); setLoading(true);
        const [Craw, Praw, Braw] = await Promise.all([
          CategoriaApi.list(),
          ProveedorApi.list(),
          BeneficioApi.list(),
        ]);

        if (!alive) return;

        const C = Array.isArray(Craw) ? Craw : [];
        const P = Array.isArray(Praw) ? Praw : [];
        const B = Array.isArray(Braw) ? Braw : [];

        setCats(C);
        setProvs(P);

        // Normaliza: todos los items con id estable
        console.log("🧩 Braw example:", B[0]);
        setItems(B.map(mapBenefitId));

      } catch {
        setErr("No se pudieron cargar los datos.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // match helpers (aceptan id o name:<etiqueta>)
  function matchCatSel(b, sel) {
    if (!sel) return true;
    const bId   = lower(b.categoriaId ?? b.categoria?.id);
    const bName = lower(b.categoriaNombre ?? b.categoria);
    if (isNameSel(sel)) return bName && bName === lower(nameOfSel(sel));
    return bId && bId === lower(sel);
  }
  function matchProvSel(b, sel) {
    if (!sel) return true;
    const bId   = lower(b.proveedorId ?? b.proveedor?.id);
    const bName = lower(b.proveedorNombre ?? b.proveedor);
    if (isNameSel(sel)) return bName && bName === lower(nameOfSel(sel));
    return bId && bId === lower(sel);
  }

  // 1) filtro por texto (base para chips)
  const itemsByText = useMemo(() => {
    const q = lower(query);
    if (!q) return items;
    return items.filter(b => {
      const hay = [b.titulo, b.proveedorNombre, b.categoriaNombre]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  // 2) universos para cada chip (respetando el otro chip)
  const itemsForCats  = useMemo(() => itemsByText.filter(b => matchProvSel(b, selProv)), [itemsByText, selProv]);
  const itemsForProvs = useMemo(() => itemsByText.filter(b => matchCatSel(b, selCat)),  [itemsByText, selCat]);

  // 3) chips de categorías (usando catálogo para etiquetas “canónicas”)
  const visibleCats = useMemo(() => {
    const hit = new Map(); // sel -> { label, count }

    for (const b of itemsForCats) {
      const rawId = normId(b.categoriaId ?? b.categoria?.id);
      const inline = String(b.categoriaNombre ?? b.categoria ?? "").trim();
      const fromCatalog =
        String(
          cats.find(c =>
            normId(
              c?.id ?? c?.Id ?? c?.categoriaId ?? c?.CategoriaId ??
              c?.categoriaID ?? c?.CategoriaID ?? c?.idCategoria ?? c?.IdCategoria ??
              c?.categoria?.id ?? c?.categoria?.Id
            ) === rawId
          )?.titulo ??
          cats.find(c =>
            normId(
              c?.id ?? c?.Id ?? c?.categoriaId ?? c?.CategoriaId ??
              c?.categoriaID ?? c?.CategoriaID ?? c?.idCategoria ?? c?.IdCategoria ??
              c?.categoria?.id ?? c?.categoria?.Id
            ) === rawId
          )?.nombre ?? ""
        ).trim();

      if (!rawId) {
        if (isMeaningful(inline)) {
          const sel = `name:${inline}`;
          const prev = hit.get(sel);
          hit.set(sel, { label: inline, count: (prev?.count ?? 0) + 1 });
        }
        continue;
      }

      const label = isMeaningful(inline) ? inline : (fromCatalog || rawId);
      if (!isMeaningful(label)) continue;

      const prev = hit.get(rawId);
      hit.set(rawId, { label, count: (prev?.count ?? 0) + 1 });
    }

    const arr = Array.from(hit, ([sel, { label, count }]) => ({
      sel, label: `${label} (${count})`, count
    }));
    arr.sort((a,b)=>a.label.localeCompare(b.label,"es",{sensitivity:"base"}));
    return arr;
  }, [itemsForCats, cats]);

  // 4) chips de proveedores (usando catálogo)
  const visibleProvs = useMemo(() => {
    const hit = new Map();

    for (const b of itemsForProvs) {
      const rawId = normId(b.proveedorId ?? b.proveedor?.id);
      const inline = String(b.proveedorNombre ?? b.proveedor ?? "").trim();
      const fromCatalog =
        String(
          provs.find(p =>
            normId(p?.id ?? p?.proveedorId ?? p?.Id ?? p?.ProveedorId) === rawId
          )?.nombre ?? ""
        ).trim();

      if (!rawId) {
        if (isMeaningful(inline)) {
          const sel = `name:${inline}`;
          const prev = hit.get(sel);
          hit.set(sel, { label: inline, count: (prev?.count ?? 0) + 1 });
        }
        continue;
      }

      const label = isMeaningful(inline) ? inline : (fromCatalog || rawId);
      if (!isMeaningful(label)) continue;

      const prev = hit.get(rawId);
      hit.set(rawId, { label, count: (prev?.count ?? 0) + 1 });
    }

    const arr = Array.from(hit, ([sel, { label, count }]) => ({
      sel, label: `${label} (${count})`, count
    }));
    arr.sort((a,b)=>a.label.localeCompare(b.label,"es",{sensitivity:"base"}));
    return arr;
  }, [itemsForProvs, provs]);

  // 5) listado final
  const filtered = useMemo(() => {
    const q = lower(query);
    return items
      .filter(b => matchCatSel(b, selCat) && matchProvSel(b, selProv))
      .filter(b => {
        if (!q) return true;
        const hay = [b.titulo, b.proveedorNombre, b.categoriaNombre]
          .filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      });
  }, [items, query, selCat, selProv]);

  // ---- CRUD
  async function save(dto, editing) {
    const id = editing?.beneficioId || editing?.BeneficioId || editing?.id || editing?.Id;

    if (id) {
      // UPDATE
      await BeneficioApi.update(id, dto);
      const freshRaw = await BeneficioApi.get(id);
      const fresh = mapBenefitId(freshRaw);
      setItems(s => s.map(x => ((x.id || x.beneficioId) === id ? fresh : mapBenefitId(x))));
    } else {
      // CREATE
      const created = await BeneficioApi.create(dto); // puede ser objeto, id o null (204)
      let freshRaw = created;

      if (freshRaw == null) {
        // fallback: recargar lista para no insertar null
        const Braw = await BeneficioApi.list();
        setItems(Braw.map(mapBenefitId));
        return;
      }
      if (typeof freshRaw === "string") {
        freshRaw = await BeneficioApi.get(freshRaw);
      }
      const fresh = mapBenefitId(freshRaw);
      setItems(s => [fresh, ...s.map(mapBenefitId)]);
    }
  }

  async function remove(id) {
    await BeneficioApi.remove(id);
    setItems(s => s.filter(x => x.id !== id));
  }

  return {
    state: {
      items, cats, provs,
      filtered, loading, err,
      query, selCat, selProv,
      visibleCats, visibleProvs,
    },
    actions: {
      setQuery, setSelCat, setSelProv,
      save, remove, setItems,
    },
  };
}
