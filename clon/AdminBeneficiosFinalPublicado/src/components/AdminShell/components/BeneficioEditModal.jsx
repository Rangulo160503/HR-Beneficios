// src/components/AdminShell/components/BeneficioEditModal.jsx
import { useEffect, useMemo, useState } from "react";
import { AprobacionesApi } from "../services/adminApi";

export default function BeneficioEditModal({
  open,
  beneficioId,
  onClose,
  onSaved,
  categorias = [],
}) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precioCRC: "",
    condiciones: "",
    vigenciaInicio: "",
    vigenciaFin: "",
    categoriaId: "",
    disponible: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!open || !beneficioId) return undefined;

    (async () => {
      try {
        setLoading(true);
        const detalle = await AprobacionesApi.obtenerDetalle(beneficioId);
        if (!alive || !detalle) return;

        setForm({
          titulo: detalle.titulo ?? "",
          descripcion: detalle.descripcion ?? "",
          precioCRC: detalle.precioCRC ?? "",
          condiciones: detalle.condiciones ?? "",
          vigenciaInicio: detalle.vigenciaInicio?.slice(0, 10) ?? "",
          vigenciaFin: detalle.vigenciaFin?.slice(0, 10) ?? "",
          categoriaId: detalle.categoriaId ?? "",
          disponible: Boolean(detalle.disponible ?? true),
        });
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [open, beneficioId]);

  const opcionesCategoria = useMemo(() => {
    const actuales = categorias ?? [];
    const extraLabel = form.categoriaId && !actuales.some((c) => c.id === form.categoriaId);
    if (extraLabel) {
      return [...actuales, { id: form.categoriaId, nombre: "Categoría actual" }];
    }
    return actuales;
  }, [categorias, form.categoriaId]);

  if (!open) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!beneficioId) return;
    setSaving(true);
    try {
      await AprobacionesApi.editar(beneficioId, form);
      onSaved?.();
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl mt-16 rounded-2xl bg-neutral-950 border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Editar beneficio</p>
            <h3 className="text-lg font-semibold text-white">{form.titulo || "Detalle"}</h3>
          </div>
          <button
            type="button"
            className="text-white/60 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {loading ? (
            <div className="text-sm text-white/60">Cargando...</div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-white/60">Título</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/60">Descripción</label>
                <textarea
                  rows="3"
                  value={form.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs text-white/60">Precio CRC</label>
                  <input
                    type="number"
                    value={form.precioCRC}
                    onChange={(e) => handleChange("precioCRC", Number(e.target.value))}
                    className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/60">Categoría</label>
                  <select
                    value={form.categoriaId}
                    onChange={(e) => handleChange("categoriaId", e.target.value)}
                    className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="" className="bg-neutral-900">Sin categoría</option>
                    {opcionesCategoria.map((c) => (
                      <option key={c.id ?? c.categoriaId} value={c.id ?? c.categoriaId} className="bg-neutral-900">
                        {c.nombre ?? c.titulo ?? "Categoría"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/60">Condiciones</label>
                <textarea
                  rows="2"
                  value={form.condiciones}
                  onChange={(e) => handleChange("condiciones", e.target.value)}
                  className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs text-white/60">Vigencia inicio</label>
                  <input
                    type="date"
                    value={form.vigenciaInicio}
                    onChange={(e) => handleChange("vigenciaInicio", e.target.value)}
                    className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/60">Vigencia fin</label>
                  <input
                    type="date"
                    value={form.vigenciaFin}
                    onChange={(e) => handleChange("vigenciaFin", e.target.value)}
                    className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.disponible}
                  onChange={(e) => handleChange("disponible", e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                />
                Disponible
              </label>
            </div>
          )}

          <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-neutral-800 text-white/80 text-sm hover:bg-neutral-700"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 disabled:opacity-70"
              disabled={saving || loading}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}