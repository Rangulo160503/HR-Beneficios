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
      <div className="w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-xl my-10 mx-4">
        <div className="bg-emerald-500 text-black text-xs px-2 py-1 mb-2">
          FORM PROVEEDOR ACTIVO
        </div>

        <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-neutral-800">
          <h2 className="text-xl font-semibold">{initial ? "Editar beneficio" : "Nuevo beneficio"}</h2>
          <button
            onClick={onCancel}
            className="text-sm text-neutral-300 hover:text-white transition"
            type="button"
          >
            ✕ Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-neutral-400">Título</span>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
              />
            </label>

            <label className="block">
              <span className="text-sm text-neutral-400">Precio (CRC)</span>
              <input
                type="number"
                name="precioCRC"
                value={form.precioCRC}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-neutral-400">Descripción</span>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
            />
          </label>

          <label className="block">
            <span className="text-sm text-neutral-400">Condiciones</span>
            <textarea
              name="condiciones"
              value={form.condiciones}
              onChange={handleChange}
              rows={2}
              className="w-full mt-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
            />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-neutral-400">Vigencia inicio</span>
              <input
                type="date"
                name="vigenciaInicio"
                value={form.vigenciaInicio}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
              />
            </label>

            <label className="block">
              <span className="text-sm text-neutral-400">Vigencia fin</span>
              <input
                type="date"
                name="vigenciaFin"
                value={form.vigenciaFin}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-neutral-400">Categoría</span>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-500/40"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => (
                <option key={c.id || c.categoriaId} value={c.id || c.categoriaId}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-neutral-400">Imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="mt-1 text-sm text-neutral-300"
            />
          </label>

          {imagePreview && (
            <div className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/80">
              <img src={imagePreview} alt="Vista previa" className="w-full object-cover max-h-64" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}