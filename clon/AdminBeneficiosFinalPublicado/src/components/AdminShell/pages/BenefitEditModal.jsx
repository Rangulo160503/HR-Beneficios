import { useEffect, useMemo, useState } from "react";
import {
  BeneficioApi,
  CategoriaApi,
  ProveedorApi,
} from "../../../services/adminApi";

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const norm = (v) => (v == null ? "" : String(v).trim());
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

export default function BenefitEditModal({ open, benefit, onClose, onSaved }) {
  const [form, setForm] = useState({});
  const [cats, setCats] = useState([]);
  const [provs, setProvs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const benefitId = useMemo(
    () => benefit?.beneficioId || benefit?.id || benefit?.Id,
    [benefit]
  );

  useEffect(() => {
    setForm({
      titulo: benefit?.titulo || "",
      descripcion: benefit?.descripcion || "",
      condiciones: benefit?.condiciones || "",
      proveedorId:
        benefit?.proveedorId || benefit?.ProveedorId || benefit?.proveedor?.id || "",
      categoriaId:
        benefit?.categoriaId || benefit?.CategoriaId || benefit?.categoria?.id || "",
      precio: benefit?.precioCRC ?? benefit?.precio ?? "",
      vigenciaInicio: benefit?.vigenciaInicio?.slice?.(0, 10) || "",
      vigenciaFin: benefit?.vigenciaFin?.slice?.(0, 10) || "",
      disponible: Boolean(benefit?.disponible ?? true),
    });
  }, [benefit]);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      try {
        const [c, p] = await Promise.all([
          CategoriaApi.list(),
          ProveedorApi.list(),
        ]);
        if (!alive) return;
        setCats(Array.isArray(c) ? c : []);
        setProvs(Array.isArray(p) ? p : []);
      } catch (err) {
        console.error("No se pudieron cargar catálogos", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!benefitId) return;
    const proveedorId = norm(form.proveedorId);
    const categoriaId = norm(form.categoriaId);
    if (!GUID_RE.test(proveedorId) || !GUID_RE.test(categoriaId)) {
      setError("Debe seleccionar proveedor y categoría válidos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const dto = {
        titulo: norm(form.titulo),
        descripcion: form.descripcion ?? "",
        condiciones: form.condiciones ?? "",
        precioCRC: form.precio === "" ? 0 : Number(form.precio),
        proveedorId,
        categoriaId,
        vigenciaInicio: form.vigenciaInicio || null,
        vigenciaFin: form.vigenciaFin || null,
        disponible: Boolean(form.disponible),
      };
      await BeneficioApi.update(benefitId, dto);
      const fresh = await BeneficioApi.get(benefitId);
      onSaved?.(mapBenefitId(fresh));
      onClose?.();
    } catch (err) {
      console.error("No se pudo actualizar", err);
      setError("No se pudo guardar el beneficio.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center px-4">
      <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Editar beneficio</p>
            <h2 className="text-xl font-semibold">{benefit?.titulo || "(Sin título)"}</h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full text-sm bg-white/5 hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="space-y-1 text-sm">
              <span className="text-white/70">Título</span>
              <input
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                value={form.titulo || ""}
                onChange={(e) => setForm((s) => ({ ...s, titulo: e.target.value }))}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-white/70">Proveedor</span>
              <select
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                value={form.proveedorId || ""}
                onChange={(e) => setForm((s) => ({ ...s, proveedorId: e.target.value }))}
              >
                <option value="">Seleccione</option>
                {provs.map((p) => (
                  <option key={p.id ?? p.proveedorId} value={p.id ?? p.proveedorId}>
                    {p.nombre ?? p.Nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-white/70">Categoría</span>
              <select
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                value={form.categoriaId || ""}
                onChange={(e) => setForm((s) => ({ ...s, categoriaId: e.target.value }))}
              >
                <option value="">Seleccione</option>
                {cats.map((c) => (
                  <option key={c.id ?? c.categoriaId} value={c.id ?? c.categoriaId}>
                    {c.titulo ?? c.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-white/70">Precio</span>
              <input
                type="number"
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                value={form.precio ?? ""}
                onChange={(e) => setForm((s) => ({ ...s, precio: e.target.value }))}
              />
            </label>
          </div>

          <label className="space-y-1 text-sm block">
            <span className="text-white/70">Descripción</span>
            <textarea
              className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
              value={form.descripcion || ""}
              rows={3}
              onChange={(e) => setForm((s) => ({ ...s, descripcion: e.target.value }))}
            />
          </label>

          <label className="space-y-1 text-sm block">
            <span className="text-white/70">Condiciones / vigencia</span>
            <textarea
              className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
              value={form.condiciones || ""}
              rows={3}
              onChange={(e) => setForm((s) => ({ ...s, condiciones: e.target.value }))}
            />
          </label>

          <div className="grid md:grid-cols-2 gap-3">
            <label className="space-y-1 text-sm">
              <span className="text-white/70">Vigencia inicio</span>
              <input
                type="date"
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                value={form.vigenciaInicio || ""}
                onChange={(e) => setForm((s) => ({ ...s, vigenciaInicio: e.target.value }))}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-white/70">Vigencia fin</span>
              <input
                type="date"
                className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
                value={form.vigenciaFin || ""}
                onChange={(e) => setForm((s) => ({ ...s, vigenciaFin: e.target.value }))}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.disponible)}
              onChange={(e) => setForm((s) => ({ ...s, disponible: e.target.checked }))}
            />
            <span className="text-white/80">Disponible</span>
          </label>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-white/10 text-sm hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
