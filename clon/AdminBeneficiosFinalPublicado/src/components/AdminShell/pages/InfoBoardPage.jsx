import { useEffect, useMemo, useState } from "react";
import { create, getById, list, mapInfoBoard, remove, update } from "../../../services/infoBoardService";
import { useConfirm } from "../../ui/ConfirmGlobal";

const blankForm = {
  titulo: "",
  descripcion: "",
  url: "",
  tipo: "",
  prioridad: 0,
  activo: true,
  fechaInicio: "",
  fechaFin: "",
};

const toDateInput = (v) => (v ? String(v).slice(0, 10) : "");
const normalizeUrl = (v) => (typeof v === "string" ? v.trim() : "");
const normalizeText = (v) => (typeof v === "string" ? v.trim() : "");

export default function InfoBoardPage() {
  const confirm = useConfirm();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [activoFilter, setActivoFilter] = useState("true");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingList(true);
        setListError("");
        const activoValue = activoFilter === "" ? null : activoFilter === "true";
        const data = await list({
          activo: activoValue,
          q: debouncedQ,
        });
        if (!alive) return;
        const mapped = Array.isArray(data) ? data.map(mapInfoBoard) : [];
        setItems(mapped);

        if (selectedId) {
          const still = mapped.find((i) => i.id === selectedId);
          if (!still) {
            setSelectedId(null);
            setForm(blankForm);
          }
        }
      } catch (err) {
        if (!alive) return;
        setListError(err?.message || "No se pudo cargar la pizarra.");
      } finally {
        if (alive) setLoadingList(false);
      }
    })();
    return () => { alive = false; };
  }, [debouncedQ, activoFilter]);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) || null,
    [items, selectedId]
  );

  async function handleSelect(item) {
    const id = typeof item === "object" ? item?.id : item;
    if (!id) {
      setSelectedId(null);
      setForm(blankForm);
      setFormError("");
      return;
    }

    setSelectedId(id);
    setFormError("");

    if (item && typeof item === "object") {
      setForm({ ...blankForm, ...item, fechaInicio: toDateInput(item.fechaInicio), fechaFin: toDateInput(item.fechaFin) });
      return;
    }

    try {
      setLoadingDetail(true);
      const raw = await getById(id);
      const mapped = mapInfoBoard(raw);
      setForm({ ...blankForm, ...mapped, fechaInicio: toDateInput(mapped.fechaInicio), fechaFin: toDateInput(mapped.fechaFin) });
    } catch (err) {
      setFormError(err?.message || "No se pudo cargar el detalle.");
    } finally {
      setLoadingDetail(false);
    }
  }

  function validate() {
    if (!normalizeText(form.titulo)) return "El título es obligatorio.";
    const url = normalizeUrl(form.url);
    if (!url) return "La URL es obligatoria.";
    if (!/^https?:\/\//i.test(url)) return "La URL debe iniciar con http o https.";
    return "";
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      setFormError(errMsg);
      return;
    }

    const payload = {
      Titulo: normalizeText(form.titulo),
      Descripcion: normalizeText(form.descripcion),
      Url: normalizeUrl(form.url),
      Tipo: normalizeText(form.tipo) || null,
      Prioridad: Number(form.prioridad) || 0,
      Activo: Boolean(form.activo),
      FechaInicio: form.fechaInicio || null,
      FechaFin: form.fechaFin || null,
    };

    try {
      setSaving(true);
      setFormError("");
      let targetId = selectedId;
      if (selectedId) {
        await update(selectedId, payload);
        targetId = selectedId;
      } else {
        const created = await create(payload);
        targetId = typeof created === "string" ? created : created?.infoBoardItemId || created?.InfoBoardItemId || created?.id;
      }
      await handleSelect(null);
      const activoValue = activoFilter === "" ? null : activoFilter === "true";
      const data = await list({ activo: activoValue, q: debouncedQ });
      const mapped = Array.isArray(data) ? data.map(mapInfoBoard) : [];
      setItems(mapped);
      const match = mapped.find((i) => i.id === targetId);
      if (match) {
        setSelectedId(match.id);
        setForm({ ...blankForm, ...match, fechaInicio: toDateInput(match.fechaInicio), fechaFin: toDateInput(match.fechaFin) });
      }
    } catch (err) {
      setFormError(err?.message || "No se pudo guardar el anuncio.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    const ok = await confirm("¿Eliminar este anuncio?", { okText: "Eliminar", cancelText: "Cancelar" });
    if (!ok) return;
    try {
      await remove(selectedId);
      setSelectedId(null);
      setForm(blankForm);
      const activoValue = activoFilter === "" ? null : activoFilter === "true";
      const data = await list({ activo: activoValue, q: debouncedQ });
      setItems(Array.isArray(data) ? data.map(mapInfoBoard) : []);
    } catch (err) {
      setFormError(err?.message || "No se pudo eliminar el anuncio.");
    }
  }

  const empty = !loadingList && !listError && items.length === 0;

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-white/70">Activo</label>
            <select
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              value={activoFilter}
              onChange={(e) => setActivoFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Solo activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
          <input
            type="search"
            placeholder="Buscar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full sm:w-64"
          />
        </div>
        <button
          onClick={() => handleSelect(null)}
          className="px-3 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90"
        >
          Limpiar
        </button>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(320px,420px)_1fr]">
        <div className="rounded-2xl border border-white/10 bg-black/40 divide-y divide-white/5">
          {loadingList && (
            <p className="px-4 py-3 text-sm text-white/60">Cargando…</p>
          )}
          {listError && (
            <p className="px-4 py-3 text-sm text-red-300" role="alert">{listError}</p>
          )}
          {items.map((item) => {
            const active = selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-4 py-3 transition border-l-4 ${
                  active ? "bg-white/5 border-emerald-400/80" : "border-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{item.titulo || "(Sin título)"}</p>
                    <p className="text-xs text-white/50 truncate">
                      {item.tipo || "—"} • Prioridad {item.prioridad ?? 0}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                      {item.fechaInicio || item.fechaFin
                        ? `${toDateInput(item.fechaInicio) || ""}${item.fechaFin ? ` → ${toDateInput(item.fechaFin)}` : ""}`
                        : "Sin vigencia"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      item.activo
                        ? "border-emerald-400/40 text-emerald-200 bg-emerald-400/10"
                        : "border-white/10 text-white/60"
                    }`}
                  >
                    {item.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </button>
            );
          })}
          {empty && (
            <p className="px-4 py-6 text-xs text-white/50">No hay anuncios para los filtros aplicados.</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{selectedItem ? "Editar" : "Nuevo anuncio"}</h3>
              <p className="text-xs text-white/50">Define la tarjeta que verán los colaboradores.</p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm((s) => ({ ...s, activo: e.target.checked }))}
                className="accent-emerald-400 w-4 h-4"
              />
              Activo
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/60 mb-1">Título *</label>
              <input
                value={form.titulo}
                onChange={(e) => setForm((s) => ({ ...s, titulo: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-white/60 mb-1">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm((s) => ({ ...s, descripcion: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[90px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-white/60 mb-1">URL *</label>
              <input
                value={form.url}
                onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="https://"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">Tipo</label>
              <input
                value={form.tipo}
                onChange={(e) => setForm((s) => ({ ...s, tipo: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">Prioridad</label>
              <input
                type="number"
                value={form.prioridad}
                onChange={(e) => setForm((s) => ({ ...s, prioridad: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">Fecha inicio</label>
              <input
                type="date"
                value={form.fechaInicio}
                onChange={(e) => setForm((s) => ({ ...s, fechaInicio: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">Fecha fin</label>
              <input
                type="date"
                value={form.fechaFin}
                onChange={(e) => setForm((s) => ({ ...s, fechaFin: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-300" role="alert">{formError}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[var(--brand)] text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => handleSelect(selectedItem)}
              className="px-4 py-2 rounded-xl border border-white/10 text-sm"
            >
              Cancelar
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl border border-red-400/50 text-sm text-red-200 hover:bg-red-500/10"
              >
                Eliminar
              </button>
            )}
            {loadingDetail && <span className="text-xs text-white/50">Cargando detalle…</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
