import { useEffect, useMemo, useState } from "react";
import AprobacionesApi from "../services/adminApi";

function BeneficioEditModal({ open, beneficioId, onClose, onSaved, categorias = [] }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precioCRC: "",
    condiciones: "",
    vigenciaInicio: "",
    vigenciaFin: "",
    categoriaId: "",
    disponible: true,
    categoriaNombre: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && beneficioId) {
      setLoading(true);
      setError("");
      AprobacionesApi.obtenerDetalle(beneficioId)
        .then((detalle) => {
          setForm({
            titulo: detalle.titulo || "",
            descripcion: detalle.descripcion || "",
            precioCRC: detalle.precioCRC ?? "",
            condiciones: detalle.condiciones || "",
            vigenciaInicio: detalle.vigenciaInicio ? detalle.vigenciaInicio.slice(0, 10) : "",
            vigenciaFin: detalle.vigenciaFin ? detalle.vigenciaFin.slice(0, 10) : "",
            categoriaId: detalle.categoriaId || "",
            disponible: detalle.disponible ?? true,
            categoriaNombre: detalle.categoriaNombre || "",
          });
        })
        .catch((err) => {
          console.error("[Aprobaciones] Error cargando detalle", err);
          setError("No se pudo cargar el beneficio.");
        })
        .finally(() => setLoading(false));
    } else if (!open) {
      setError("");
    }
  }, [open, beneficioId]);

  const categoriaOpciones = useMemo(() => {
    if (categorias.length > 0) return categorias;
    if (form.categoriaId) {
      return [
        {
          categoriaId: form.categoriaId,
          nombre: form.categoriaNombre || "Categoría actual",
        },
      ];
    }
    return [];
  }, [categorias, form.categoriaId, form.categoriaNombre]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beneficioId) return;
    if (!form.titulo.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precioCRC: Number(form.precioCRC),
        condiciones: form.condiciones,
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFin: form.vigenciaFin,
        categoriaId: form.categoriaId,
        disponible: form.disponible,
      };
      await AprobacionesApi.editar(beneficioId, payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error("[Aprobaciones] Error al guardar", err);
      setError("No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto">
      <div className="w-full max-w-xl mx-auto mt-16 mb-12">
        <div className="rounded-2xl bg-neutral-950 border border-white/10 shadow-2xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">Editar beneficio</h3>
              <p className="text-sm text-white/60">Actualiza los datos del beneficio aprobado.</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white text-sm px-2"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[11px] uppercase text-white/40 tracking-wide">Título</label>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Nombre del beneficio"
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase text-white/40 tracking-wide">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe el beneficio"
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase text-white/40 tracking-wide">Precio (CRC)</label>
              <input
                type="number"
                name="precioCRC"
                value={form.precioCRC}
                onChange={handleChange}
                className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="₡0"
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase text-white/40 tracking-wide">Condiciones</label>
              <textarea
                name="condiciones"
                value={form.condiciones}
                onChange={handleChange}
                className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Restricciones, vigencias, etc."
                disabled={loading || saving}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[11px] uppercase text-white/40 tracking-wide">Vigencia inicio</label>
                <input
                  type="date"
                  name="vigenciaInicio"
                  value={form.vigenciaInicio}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading || saving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase text-white/40 tracking-wide">Vigencia fin</label>
                <input
                  type="date"
                  name="vigenciaFin"
                  value={form.vigenciaFin}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading || saving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase text-white/40 tracking-wide">Categoría</label>
              <select
                name="categoriaId"
                value={form.categoriaId || ""}
                onChange={handleChange}
                className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading || saving}
              >
                <option value="">Selecciona una categoría</option>
                {categoriaOpciones.map((c) => (
                  <option key={c.categoriaId || c.id} value={c.categoriaId || c.id}>
                    {c.nombre || c.descripcion || "Categoría"}
                  </option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                name="disponible"
                checked={!!form.disponible}
                onChange={handleChange}
                className="h-4 w-4 rounded border border-white/20 bg-neutral-900"
                disabled={loading || saving}
              />
              <span>Disponible</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-neutral-800 text-sm hover:bg-neutral-700 border border-white/10"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-emerald-500 text-sm text-black font-semibold hover:bg-emerald-400"
                disabled={saving || loading}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BeneficioEditModal;