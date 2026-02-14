import { useEffect, useMemo, useRef, useState } from "react";
import { BeneficioApi, CategoriaApi } from "../../services/adminApi";

export default function ProveedorBeneficioForm({
  initial = null,
  onSaved,
  onCancel,
}) {
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

  // (solo debug, podés quitarlo luego)
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
      vigenciaInicio: initial.vigenciaInicio
        ? initial.vigenciaInicio.slice(0, 10)
        : "",
      vigenciaFin: initial.vigenciaFin ? initial.vigenciaFin.slice(0, 10) : "",
      categoriaId: initial.categoriaId || "",
      imagen: initial.imagen || null,
    });
  }, [initial]);

  const imagePreview = useMemo(() => {
    if (!form.imagen) return null;
    if (String(form.imagen).startsWith("data:")) return form.imagen;
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

    if (saving) return; // prevenir envíos múltiples

    const proveedorId = localStorage.getItem("proveedorId");
    const guidRegex = /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;

    if (!proveedorId || !guidRegex.test(proveedorId)) {
      console.error("[Proveedor] proveedorId inválido o ausente", proveedorId);
      alert(
        "No se encontró el proveedor asignado. Abra el portal desde su código QR."
      );
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
        vigenciaInicio: form.vigenciaInicio
          ? new Date(form.vigenciaInicio).toISOString()
          : null,
        vigenciaFin: form.vigenciaFin
          ? new Date(form.vigenciaFin).toISOString()
          : null,
        imagen: form.imagen || null,
      };
      console.log("[Proveedor] payload a enviar:", payload);
      
      if (initial && (initial.beneficioId || initial.id)) {
        const id = initial.beneficioId || initial.id;
        await BeneficioApi.update(id, payload);
        alert("Beneficio actualizado exitosamente");
      } else {
      await BeneficioApi.create(payload);
      alert("Beneficio creado exitosamente");
      }
      onSaved?.();
    } catch (error) {
      console.error("No se pudo guardar el beneficio", error);
      alert("No se pudo guardar el beneficio. Revisa la consola para más detalles.");
    } finally {
      setSaving(false);
    }
  };

  // === estilos congruentes tipo FullForm (Admin) ===
  const baseInput =
    "w-full rounded-xl bg-neutral-900/70 border border-white/15 px-3.5 py-2.5 text-sm md:text-base " +
    "placeholder:text-white/40 text-white " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 " +
    "transition-colors duration-150";

  const sectionCard =
    "rounded-2xl bg-neutral-900/80 border border-white/10 shadow-lg shadow-black/40 p-3 md:p-4 space-y-3";

  const labelCls = "text-xs md:text-sm text-white/80";
  const helperCls = "text-[11px] md:text-xs text-white/45";

  // scroller guard (por si en móvil el teclado tapa campos)
  const scrollerRef = useRef(null);
  function revealBeforeOpen(el) {
    const sc = scrollerRef.current;
    if (!sc || !el) return;
    const GUARD = 72;
    const sRect = sc.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const topInScroller = eRect.top - sRect.top;
    if (topInScroller < GUARD) sc.scrollTop += topInScroller - GUARD;
  }

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur flex items-start justify-center md:items-center">
      <div
        className="
          w-full max-w-[920px]
          mx-2 my-3 md:my-6
          bg-neutral-950 border border-white/10
          md:rounded-2xl md:shadow-2xl
          flex flex-col
          max-h-[calc(100vh-1.5rem)] md:max-h-[92vh]
          text-white
        "
      >
        {/* Header fijo */}
        <div className="h-14 px-4 flex items-center gap-3 bg-neutral-950/95 backdrop-blur border-b border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 bg-neutral-900/80 px-4 py-1.5 text-sm font-medium text-white/80 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            Cerrar
          </button>

          <div className="text-base md:text-lg font-semibold flex-1 text-center md:text-left">
            {initial ? "Editar beneficio" : "Nuevo beneficio"}
          </div>

          <button
            form="prov-benef-form"
            disabled={saving}
            className="rounded-full px-5 py-1.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>

        {/* Body scrolleable */}
        <div
          ref={scrollerRef}
          className="overflow-auto max-h-[calc(100svh-56px)] md:max-h-[calc(92vh-56px)]"
        >
          <form
            id="prov-benef-form"
            onSubmit={handleSubmit}
            className="p-4 md:p-6 space-y-4 text-[14px] md:text-base leading-6"
          >
            {/* Datos principales */}
            <section className={sectionCard}>
              <h3 className="text-sm md:text-base font-semibold text-white">
                Datos principales
              </h3>

              <div className="space-y-2">
                <label className={labelCls}>Título</label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  className={baseInput}
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
                <div className="relative">
                  <select
                    name="categoriaId"
                    value={form.categoriaId}
                    onChange={handleChange}
                    onMouseDown={(e) => revealBeforeOpen(e.currentTarget)}
                    onFocus={(e) => revealBeforeOpen(e.currentTarget)}
                    className={`${baseInput} appearance-none pr-10`}
                  >
                    <option value="">-- Seleccione --</option>
                    {categorias.map((c) => {
                      const val = c.id || c.categoriaId;
                      const label = c.nombre ?? c.Nombre ?? c.titulo ?? "—";
                      return (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown />
                </div>
                <div className={helperCls}>
                  La categoría ayuda a que el beneficio aparezca en la sección correcta.
                </div>
              </div>
            </section>

            {/* Imagen */}
            <section className={sectionCard}>
              <h3 className="text-sm md:text-base font-semibold text-white">
                Imagen
              </h3>

              <label className="block space-y-2">
                <span className={labelCls}>Subir imagen (jpg/png)</span>
                <div className="flex items-center gap-3">
  {/* input REAL (oculto) */}
  <input
    id="prov-img"
    type="file"
    accept="image/*"
    onChange={handleFile}
    className="hidden"
  />

  {/* botón visual */}
  <label
    htmlFor="prov-img"
    className="
      inline-flex items-center justify-center
      rounded-full px-4 py-2
      bg-emerald-500 hover:bg-emerald-400
      text-sm font-semibold text-black
      cursor-pointer
      shadow-md shadow-emerald-500/30
      transition-colors
    "
  >
    Elegir imagen
  </label>

  {/* estado */}
  <span className="text-xs text-white/50 truncate">
    {form.imagen ? "Imagen seleccionada" : "Ninguna imagen seleccionada"}
  </span>
</div>

                <span className={helperCls}>
                  Recomendado: una imagen clara del producto/servicio.
                </span>
              </label>

              <div className="mt-2 aspect-video bg-neutral-800 rounded-xl grid place-items-center overflow-hidden border border-white/10">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-xs md:text-sm text-white/60">Sin imagen</p>
                )}
              </div>
            </section>

            {/* Descripción y condiciones */}
            <section className={sectionCard}>
              <h3 className="text-sm md:text-base font-semibold text-white">
                Descripción y condiciones
              </h3>

              <div className="space-y-2">
                <label className={labelCls}>Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className={baseInput}
                />
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Condiciones</label>
                <textarea
                  name="condiciones"
                  value={form.condiciones}
                  onChange={handleChange}
                  rows={3}
                  className={baseInput}
                />
              </div>
            </section>

            {/* Vigencia */}
            <section className={sectionCard}>
              <h3 className="text-sm md:text-base font-semibold text-white">
                Vigencia
              </h3>

              <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelCls}>Inicio</label>
                  <input
                    type="date"
                    name="vigenciaInicio"
                    value={form.vigenciaInicio}
                    onChange={handleChange}
                    className={baseInput}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>Fin</label>
                  <input
                    type="date"
                    name="vigenciaFin"
                    value={form.vigenciaFin}
                    onChange={handleChange}
                    className={baseInput}
                  />
                </div>
              </div>

              <p className={helperCls}>
                Si no tiene fecha fin, podés dejarla vacía (si el API lo permite).
              </p>
            </section>

            {/* Espacio inferior para no quedar pegado al borde en móvil */}
            <div className="h-2" />
          </form>
        </div>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.19l3.71-2.96a.75.75 0 1 1 .94 1.16l-4.24 3.38a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z"
        clipRule="evenodd"
      />
    </svg>
  );
}
