import { useEffect, useMemo, useState } from "react";
import { BeneficioApi } from "../../../services/adminApi";

const PAGE_SIZE = 50;

const normId = (v) => (v == null ? "" : String(v).trim());
const getCatId = (r) =>
  normId(
    r?.id ??
      r?.Id ??
      r?.categoriaId ??
      r?.CategoriaId ??
      r?.categoriaID ??
      r?.CategoriaID ??
      r?.idCategoria ??
      r?.IdCategoria ??
      r?.categoria?.id ??
      r?.categoria?.Id
  );

export default function CategoriaEnUsoModal({
  open,
  onClose,
  categoria,
  cats = [],
  onReasignar,
  onEditBenefit,
}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [destCatId, setDestCatId] = useState("");
  const categoriaId = useMemo(() => getCatId(categoria), [categoria]);

  const selectableCats = useMemo(
    () => cats.filter((c) => getCatId(c) && getCatId(c) !== categoriaId),
    [cats, categoriaId]
  );

  useEffect(() => {
    if (!open || !categoriaId) return;
    setItems([]);
    setPage(1);
    setTotal(0);
    setSelected(new Set());
    setDestCatId("");
    setSearch("");
    cargar(1, false, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, categoriaId]);

  const cargar = async (nextPage = 1, append = false, currentSearch = search) => {
    if (!categoriaId) return;
    setLoading(true);
    setError("");
    try {
      const res = await BeneficioApi.listByCategoria(categoriaId, nextPage, PAGE_SIZE, currentSearch);
      const nuevos = Array.isArray(res?.items) ? res.items : [];
      setTotal(res?.total ?? 0);
      setPage(nextPage);
      setItems((prev) => (append ? [...prev, ...nuevos] : nuevos));
    } catch (err) {
      console.error("No se pudo cargar la lista de beneficios", err);
      setError("No se pudo cargar la lista de beneficios.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const moveSelected = async () => {
    if (!destCatId) {
      setError("Selecciona la categoría destino.");
      return;
    }
    const ids = Array.from(selected);
    await onReasignar?.({
      fromCategoriaId: categoriaId,
      toCategoriaId: destCatId,
      beneficioIds: ids.length > 0 ? ids : null,
      beneficios: items.filter((b) => ids.length === 0 || ids.includes(b.beneficioId || b.id)),
    });
    setSelected(new Set());
    setDestCatId("");
  };

  const canLoadMore = items.length < total;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Categoría en uso</p>
            <h2 className="text-xl font-semibold">
              {categoria?.nombre ?? categoria?.titulo ?? "Categoría"}
            </h2>
            {categoria?.detalle?.count != null && (
              <p className="text-sm text-white/60">
                Beneficios asociados: {categoria.detalle.count}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full text-sm bg-white/5 hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                placeholder="Buscar beneficio"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 text-sm"
              />
              <button
                onClick={() => cargar(1, false, search)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
              >
                Buscar
              </button>
              <button
                onClick={() => {
                  setSearch("");
                  cargar(1, false, "");
                }}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm"
              >
                Limpiar
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 divide-y divide-white/5 bg-black/40">
              {items.map((b) => {
                const id = normId(b?.beneficioId ?? b?.id);
                const checked = selected.has(id);
                return (
                  <div key={id || b.titulo} className="px-4 py-3 flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelect(id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-tight">{b.titulo || "(Sin título)"}</p>
                      <p className="text-xs text-white/60">
                        {b.proveedorNombre || "Proveedor"} · {b.categoriaNombre || "Categoría"}
                      </p>
                    </div>
                    <button
                      onClick={() => onEditBenefit?.(b)}
                      className="px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10"
                    >
                      Editar
                    </button>
                  </div>
                );
              })}

              {!loading && items.length === 0 && (
                <p className="px-4 py-6 text-sm text-white/50">No hay beneficios para esta categoría.</p>
              )}

              {loading && (
                <p className="px-4 py-3 text-sm text-white/60">Cargando beneficios…</p>
              )}
            </div>

            {canLoadMore && (
              <button
                onClick={() => cargar(page + 1, true, search)}
                className="px-3 py-2 rounded-full text-sm bg-white/10 hover:bg-white/20"
                disabled={loading}
              >
                Cargar más
              </button>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 p-4 bg-black/40">
            <h3 className="font-semibold">Reasignar beneficios</h3>
            <p className="text-xs text-white/60">
              Selecciona uno o más beneficios, o deja la selección vacía para mover todos.
            </p>
            <div className="space-y-2">
              <label className="text-sm text-white/70 block">Categoría destino</label>
              <select
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                value={destCatId}
                onChange={(e) => setDestCatId(e.target.value)}
              >
                <option value="">Seleccione</option>
                {selectableCats.map((c) => (
                  <option key={getCatId(c)} value={getCatId(c)}>
                    {c.nombre ?? c.titulo}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
              onClick={moveSelected}
              disabled={loading}
              className="w-full px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-60"
            >
              Mover {selected.size > 0 ? `${selected.size} seleccionado(s)` : "todos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
