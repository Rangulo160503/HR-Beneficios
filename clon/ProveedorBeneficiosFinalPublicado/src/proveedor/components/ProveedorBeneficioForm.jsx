import { useEffect, useMemo, useRef, useState } from "react";
import { CategoriaApi } from "../../services/adminApi";

export default function ProveedorBeneficioForm({
  initial = null,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precioCRC: "",
    precioDesde: false,
    condiciones: "",
    vigenciaInicio: "",
    vigenciaFin: "",
    categoriaId: "",
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [saving, setSaving] = useState(false);

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
      precioDesde: initial.precioDesde ?? false,
      condiciones: initial.condiciones || "",
      vigenciaInicio: initial.vigenciaInicio
        ? initial.vigenciaInicio.slice(0, 10)
        : "",
      vigenciaFin: initial.vigenciaFin
        ? initial.vigenciaFin.slice(0, 10)
        : "",
      categoriaId: initial.categoriaId || "",
    });
  }, [initial]);

  const imagePreview = useMemo(() => {
    if (imagenFile) return URL.createObjectURL(imagenFile);
    if (initial?.imagen)
      return `data:image/jpeg;base64,${initial.imagen}`;
    return null;
  }, [imagenFile, initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("El archivo seleccionado no es una imagen válida.");
      return;
    }

    if (file.size > 5_000_000) {
      alert("La imagen no puede superar 5MB.");
      return;
    }

    setImagenFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const proveedorId = localStorage.getItem("proveedorId");
    const token = new URLSearchParams(window.location.search).get("token");

    if (!proveedorId) {
      alert("No se encontró el proveedor asignado.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("Titulo", form.titulo);
      formData.append("Descripcion", form.descripcion);
      formData.append("PrecioCRC", Number(form.precioCRC) || 0);
      formData.append("PrecioDesde", !!form.precioDesde);
      formData.append("Condiciones", form.condiciones || "");
      formData.append("VigenciaInicio", form.vigenciaInicio || "");
      formData.append("VigenciaFin", form.vigenciaFin || "");
      formData.append("CategoriaId", form.categoriaId || "");

      if (imagenFile) {
        formData.append("imagen", imagenFile);
      }

      if (initial?.beneficioId || initial?.id) {
        const id = initial.beneficioId || initial.id;
        await fetch(`/api/Beneficio/${id}`, {
          method: "PUT",
          body: formData,
        });
        alert("Beneficio actualizado exitosamente");
      } else {
        await fetch(
          `/api/Beneficio?proveedorId=${proveedorId}&token=${token}`,
          {
            method: "POST",
            body: formData,
          }
        );
        alert("Beneficio creado exitosamente");
      }

      onSaved?.();
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el beneficio.");
    } finally {
      setSaving(false);
    }
  };

  const baseInput =
    "w-full rounded-xl bg-neutral-900/70 border border-white/15 px-3.5 py-2.5 text-sm md:text-base " +
    "placeholder:text-white/40 text-white " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-colors duration-150";

  const sectionCard =
    "rounded-2xl bg-neutral-900/80 border border-white/10 shadow-lg shadow-black/40 p-3 md:p-4 space-y-3";

  const labelCls = "text-xs md:text-sm text-white/80";
  const helperCls = "text-[11px] md:text-xs text-white/45";

  const scrollerRef = useRef(null);

  return (
  <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur flex items-start justify-center md:items-center">
    <div className="w-full max-w-[920px] mx-2 my-3 md:my-6 bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-white">

      {/* HEADER */}
      <div className="h-14 px-4 flex items-center gap-3 bg-neutral-950/95 border-b border-white/10">
        <button
          onClick={onCancel}
          className="rounded-full border border-white/15 bg-neutral-900 px-4 py-1.5 text-sm text-white/80 hover:bg-neutral-800 transition-colors"
        >
          Cerrar
        </button>

        <div className="flex-1 text-center font-semibold text-lg">
          {initial ? "Editar beneficio" : "Nuevo beneficio"}
        </div>

        <button
          form="prov-benef-form"
          disabled={saving}
          className="rounded-full px-5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <div className="overflow-auto p-6 space-y-6">

        <form id="prov-benef-form" onSubmit={handleSubmit} className="space-y-6">

          {/* DATOS PRINCIPALES */}
          <section className={sectionCard}>
            <h3 className="text-base font-semibold text-white">
              Datos principales
            </h3>

            <div className="space-y-2">
              <label className={labelCls}>Título</label>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className={baseInput}
                required
              />
            </div>

              <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
                <div className="space-y-2">
                  <label className={labelCls}>Precio (CRC)</label>
                  <input
                    type="number"
                    name="precioCRC"
                    value={form.precioCRC}
                    onMouseDown={(e) => revealBeforeOpen(e.currentTarget)}
                    onFocus={(e) => revealBeforeOpen(e.currentTarget)}
                    onChange={handleChange}
                    className={`${baseInput} appearance-none [-moz-appearance:textfield]
                      [&::-webkit-outer-spin-button]:appearance-none
                      [&::-webkit-inner-spin-button]:appearance-none`}
                  />
                  <div className={helperCls}>Usá el monto en colones.</div>

                  <label className="inline-flex items-center gap-2 text-xs text-white/70">
  <input
    type="checkbox"
    checked={!!form.precioDesde}
    onChange={(e) =>
      setForm((prev) => ({ ...prev, precioDesde: e.target.checked }))
    }
    className="h-4 w-4 rounded border border-white/20 bg-neutral-900"
  />
  <span>Mostrar como “A partir de”</span>
</label>
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>Moneda</label>
                  <input
                    disabled
                    value="CRC"
                    className={`${baseInput} opacity-60`}
                  />
                </div>
              </div>

            <div className="space-y-2">
              <label className={labelCls}>Categoría</label>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                className={baseInput}
              >
                <option value="">-- Seleccione --</option>
                {categorias.map((c) => (
                  <option
                    key={c.id || c.categoriaId}
                    value={c.id || c.categoriaId}
                  >
                    {c.nombre ?? c.Nombre ?? "—"}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* IMAGEN */}
          <section className={sectionCard}>
            <h3 className="text-base font-semibold text-white">
              Imagen
            </h3>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-500 file:text-black file:font-semibold hover:file:bg-emerald-400"
            />

            <div className="mt-4 aspect-video bg-neutral-800 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                  alt="Vista previa"
                />
              ) : (
                <span className="text-white/40 text-sm">
                  Sin imagen
                </span>
              )}
            </div>
          </section>

          {/* DESCRIPCIÓN */}
          <section className={sectionCard}>
            <h3 className="text-base font-semibold text-white">
              Descripción y condiciones
            </h3>

            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
              className={baseInput}
              placeholder="Descripción del beneficio"
            />

            <textarea
              name="condiciones"
              value={form.condiciones}
              onChange={handleChange}
              rows={3}
              className={baseInput}
              placeholder="Condiciones"
            />
          </section>

          {/* VIGENCIA */}
          <section className={sectionCard}>
            <h3 className="text-base font-semibold text-white">
              Vigencia
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                name="vigenciaInicio"
                value={form.vigenciaInicio}
                onChange={handleChange}
                className={baseInput}
              />
              <input
                type="date"
                name="vigenciaFin"
                value={form.vigenciaFin}
                onChange={handleChange}
                className={baseInput}
              />
            </div>
          </section>

        </form>
      </div>
    </div>
  </div>
);
}