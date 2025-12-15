import { useEffect, useMemo, useState } from "react";
import { BeneficioApi, CategoriaApi } from "../../services/adminApi";

export default function ProveedorBeneficioForm({ initial = null, onSaved, onCancel }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precioCRC: "",
    condiciones: "",
    vigenciaInicio: "",
    vigenciaFin: "",
    categoriaId: "",
    imagen: null,
  });
  const [categorias, setCategorias] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log("✅ ProveedorBeneficioForm montado");
  }, []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await CategoriaApi.list();
        if (!cancel) setCategorias(data || []);
      } catch (error) {
        console.error("Error cargando categorías", error);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!initial) return;
    setForm({
      titulo: initial.titulo || "",
      descripcion: initial.descripcion || "",
      precioCRC: initial.precioCRC ?? "",
      condiciones: initial.condiciones || "",
      vigenciaInicio: initial.vigenciaInicio ? initial.vigenciaInicio.slice(0, 10) : "",
      vigenciaFin: initial.vigenciaFin ? initial.vigenciaFin.slice(0, 10) : "",
      categoriaId: initial.categoriaId || "",
      imagen: initial.imagen || null,
    });
  }, [initial]);

  const imagePreview = useMemo(() => {
    if (!form.imagen) return null;
    if (form.imagen.startsWith("data:")) return form.imagen;
    return `data:image/jpeg;base64,${form.imagen}`;
  }, [form.imagen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    setForm((prev) => ({ ...prev, imagen: base64 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const proveedorId = localStorage.getItem("proveedorId");
    const guidRegex = /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;

    if (!proveedorId || !guidRegex.test(proveedorId)) {
      console.error("[Proveedor] proveedorId inválido o ausente", proveedorId);
      alert("No se encontró el proveedor asignado. Abra el portal desde su código QR.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        proveedorId,
        categoriaId: form.categoriaId || null,
        titulo: form.titulo,
        descripcion: form.descripcion,
        precioCRC: Number(form.precioCRC) || 0,
        condiciones: form.condiciones,
        vigenciaInicio: form.vigenciaInicio ? new Date(form.vigenciaInicio).toISOString() : null,
        vigenciaFin: form.vigenciaFin ? new Date(form.vigenciaFin).toISOString() : null,
        imagen: form.imagen || null,
      };
      console.log("[Proveedor] payload a enviar:", payload);

      await BeneficioApi.create(payload);
      alert("El beneficio fue enviado para aprobación. Un administrador debe aprobarlo antes de que aparezca publicado.");
      onSaved?.();
    } catch (error) {
      console.error("No se pudo guardar el beneficio", error);
      alert("No se pudo guardar el beneficio. Revisa la consola para más detalles.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto">
      <div className="w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-2xl shadow-xl my-10 mx-4 text-white">
        <div className="bg-emerald-500 text-black text-xs px-2 py-1 mb-2">
          FORM PROVEEDOR ACTIVO
        </div>

        <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-semibold">{initial ? "Editar beneficio" : "Nuevo beneficio"}</h2>
          <button
            onClick={onCancel}
            className="text-sm text-neutral-300 hover:text-white transition"
            type="button"
          >
            ✕ Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="block text-xs text-neutral-400 mb-1">Título</span>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>

            <label className="block space-y-1">
              <span className="block text-xs text-neutral-400 mb-1">Precio (CRC)</span>
              <input
                type="number"
                name="precioCRC"
                value={form.precioCRC}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="block text-xs text-neutral-400 mb-1">Descripción</span>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </label>

          <label className="block space-y-1">
            <span className="block text-xs text-neutral-400 mb-1">Condiciones</span>
            <textarea
              name="condiciones"
              value={form.condiciones}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="block text-xs text-neutral-400 mb-1">Vigencia inicio</span>
              <input
                type="date"
                name="vigenciaInicio"
                value={form.vigenciaInicio}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>

            <label className="block space-y-1">
              <span className="block text-xs text-neutral-400 mb-1">Vigencia fin</span>
              <input
                type="date"
                name="vigenciaFin"
                value={form.vigenciaFin}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="block text-xs text-neutral-400 mb-1">Categoría</span>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => (
                <option key={c.id || c.categoriaId} value={c.id || c.categoriaId}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="block text-xs text-neutral-400 mb-1">Imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-black file:font-semibold hover:file:bg-emerald-400 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </label>

          {imagePreview && (
            <div className="rounded-xl overflow-hidden border border-white/10 bg-neutral-900/80">
              <img src={imagePreview} alt="Vista previa" className="w-full object-cover max-h-64" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
