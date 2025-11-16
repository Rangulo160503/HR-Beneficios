import { useRef, useState } from "react";
import FileUpload from "./FileUpload";
import { normalizeImage } from "../../utils/image";
import { useBeneficioImagenes } from "../../hooks/useBeneficioImagenes";
import MultiFileUpload from "./MultiFileUpload";
import { fileToBase64Pure } from "../../utils/image";
import { BeneficioImagenApi } from "../../services/adminApi"; // si no existe, lo agregamos



const norm   = (v) => (v == null ? "" : String(v).trim());
// ¡importante!: siempre TRIM para evitar ids con espacios
const normId = (v) => (v == null ? "" : String(v).trim());
const isGuid = (s) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(s || ""));

// IDs posibles para categoría, siempre normalizado
const getCatId = (r) => {
  const v = r?.id ?? r?.Id ?? r?.categoriaId ?? r?.CategoriaId ??
            r?.categoriaID ?? r?.CategoriaID ?? r?.idCategoria ?? r?.IdCategoria ??
            r?.categoria?.id ?? r?.categoria?.Id;
  return v == null ? "" : String(v).trim();     // ⟵ trim
};

// IDs posibles para proveedor, siempre normalizado
const getProvId = (p) => normId(p?.id ?? p?.proveedorId ?? p?.ProveedorId ?? p?.ID);

export default function FullForm({
  initial = null,
  provs = [],
  cats = [],
  onCreateCat,          // () => Promise<categoriaCreada>
  onCreateProv,         // () => Promise<proveedorCreado>
  onCancel,
  onSave,
}) {

    console.log("🧩 initial IDs:", {
    proveedorId: initial?.proveedorId,
    categoriaId: initial?.categoriaId,
  });

  const [form, setForm] = useState(() => ({
    titulo:         initial?.titulo ?? "",
    precio:         initial?.precioCRC ?? initial?.precio ?? "",
    proveedorId:    normId(initial?.proveedorId),
    categoriaId:    normId(initial?.categoriaId),
    descripcion:    initial?.descripcion ?? "",
    condiciones:    initial?.condiciones ?? "",
    vigenciaInicio: initial?.vigenciaInicio ? String(initial.vigenciaInicio).slice(0,10) : "",
    vigenciaFin:    initial?.vigenciaFin    ? String(initial.vigenciaFin).slice(0,10)    : "",
    imagenUrl:      initial?.imagenUrl ?? initial?.imagen ?? "",
    imagenBase64:   null,
  }));
const [preview, setPreview] = useState(() =>
  normalizeImage(form.imagenUrl || "")
);

  // crear/seleccionar proveedor inline
  async function handleNewProv() {
    if (!onCreateProv) return;
    const created = await onCreateProv();
    const id = getProvId(created);
    if (id) setForm(s => ({ ...s, proveedorId: id }));
  }

  // crear/seleccionar categoría inline
  async function handleNewCat() {
    if (!onCreateCat) return;
    const created = await onCreateCat();
    const id = getCatId(created);
    if (id) setForm(s => ({ ...s, categoriaId: id }));
  }

  // subir archivo -> preview + base64
async function onPick(file) {
  if (!file) {
    setPreview("");
    setForm((s) => ({ ...s, imagenUrl: "", imagenBase64: null }));
    return;
  }
  const base64 = await fileToBase64Pure(file);
  const dataUrl = `data:${file.type || "image/jpeg"};base64,${base64}`;
  setPreview(dataUrl);
  setForm((s) => ({ ...s, imagenUrl: dataUrl, imagenBase64: base64 }));
}

  function submit(e) {
    e.preventDefault();
    const provId = normId(form.proveedorId);
    const catId  = normId(form.categoriaId);
    if (!isGuid(provId) || !isGuid(catId)) {
      alert("Debe seleccionar Proveedor y Categoría.");
      return;
    }
    const dto = {
      titulo:         norm(form.titulo),
      descripcion:    form.descripcion ?? "",
      condiciones:    form.condiciones ?? "",
      precioCRC:      form.precio !== "" ? Number(form.precio) : 0,
      proveedorId:    provId,
      categoriaId:    catId,
      vigenciaInicio: form.vigenciaInicio || null,
      vigenciaFin:    form.vigenciaFin || null,
      ...(form.imagenBase64 ? { imagen: form.imagenBase64 } : {}),
    };
    onSave?.(dto);
  }

  const baseInput =
  "w-full rounded-xl bg-neutral-900/70 border border-white/15 px-3.5 py-2.5 text-sm md:text-base " +
  "placeholder:text-white/40 text-white " +
  "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 " +
  "transition-colors duration-150";

  // asegurar visibilidad al abrir select en móviles
  const scrollerRef = useRef(null);
  function revealBeforeOpen(el) {
    const sc = scrollerRef.current;
    if (!sc || !el) return;
    const GUARD = 72;
    const sRect = sc.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const topInScroller = eRect.top - sRect.top;
    if (topInScroller < GUARD) sc.scrollTop += (topInScroller - GUARD);
  }

  // valores derivados para “opción fantasma” si el id seleccionado aún no está en la lista
  const provValue  = normId(form.proveedorId);
  const provInList = provs.some(p => getProvId(p) === provValue);
  const provLabel  = provs.find(p => getProvId(p) === provValue)?.nombre || "Proveedor nuevo";

  const catValue  = normId(form.categoriaId);
  const catInList  = cats.some(c => getCatId(c) === catValue);
  const catLabel   =
    cats.find(c => getCatId(c) === catValue)?.nombre ??
    cats.find(c => getCatId(c) === catValue)?.titulo ??
    "Categoría nueva";

console.log("🧩 select expects:", {
  provValue: String(form.proveedorId),
  catValue: String(form.categoriaId),
  provsIds: provs.map(p => String(p?.id ?? p?.proveedorId)),
  catsIds:  cats.map(c => String(c?.id ?? c?.categoriaId)),
});

  // id del beneficio cuando estamos editando
  const beneficioId = initial?.id ?? initial?.beneficioId ?? null;

  // imágenes del beneficio (solo se dispara si hay id)
  const { items: imagenes = [], loading: imgsLoading, err: imgsErr } =
  useBeneficioImagenes(beneficioId);

  // seleccionar una imagen de la galería como principal
  function handleSelectGalleryImage(img) {
    const src = normalizeImage(
      img?.imagenBase64 ?? img?.imagen ?? img?.url ?? img?.imagenUrl
    );
    if (!src) return;
    setPreview(src);
    setForm((s) => ({ ...s, imagenUrl: src, imagenBase64: null }));
  }

  // subir muchas fotos al endpoint /api/BeneficioImagen
  async function handleUploadMany(files) {
    if (!beneficioId) return;          // sin id no hay a quién asociarlas
    if (!files || files.length === 0) return;

    for (const file of files) {
      const base64 = await fileToBase64Pure(file);

      await BeneficioImagenApi.create({
        beneficioId,
        imagen: base64,
      });
    }

    alert("Fotos subidas");
    window.location.reload(); // versión rápida por ahora
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
      "
    >
      {/* Header dentro del panel */}
      <div className="h-14 px-4 flex items-center gap-3 bg-neutral-950/95 backdrop-blur">
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
    form="benef-form"
    className="rounded-full px-5 py-1.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/30 transition-colors"
  >
    Guardar
  </button>
</div>


      {/* Área scrolleable */}
      <div
        ref={scrollerRef}
        className="
    overflow-auto
    max-h-[calc(100svh-56px)]
    md:max-h-[calc(92vh-56px)]
  "
      >
        <form
          id="benef-form"
          onSubmit={submit}
          className="p-4 md:p-6 space-y-4 text-[14px] md:text-base leading-6"
        >
          {/* Datos principales */}
<section className="rounded-2xl bg-neutral-900/80 border border-white/10 shadow-lg shadow-black/40 p-3 md:p-4 space-y-3">
<h3 className="text-sm md:text-base font-semibold text-white">
  Datos principales
</h3>

            <div className="space-y-2">
<label className="text-xs md:text-sm text-white/80">Título</label>
              <input
                className={baseInput}
                value={form.titulo}
                onChange={e=>setForm(s=>({...s, titulo:e.target.value}))}
                required
              />
            </div>

            <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
              <div className="space-y-2">
                <label className="text-xs md:text-sm text-white/80">Precio (CRC)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  className={`${baseInput} appearance-none [-moz-appearance:textfield]
                              [&::-webkit-outer-spin-button]:appearance-none
                              [&::-webkit-inner-spin-button]:appearance-none`}
                  value={form.precio}
                  onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                  onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                  onChange={e=>setForm(s=>({...s, precio:e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Moneda</label>
                <input disabled value="CRC" className={`${baseInput} opacity-60`} />
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
              {/* Proveedor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs md:text-sm text-white/80">Proveedor</label>
                  <button
                    type="button"
                    onClick={handleNewProv}
                    className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white"
                  >
                    + nuevo
                  </button>
                </div>
                <div className="relative">
                  <select
                    className={`${baseInput} appearance-none pr-10`}
                    value={provValue}
                    onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                    onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                    onChange={e=>setForm(s=>({...s, proveedorId:normId(e.target.value)}))}
                  >
                    {!provInList && provValue && <option value={provValue}>{provLabel}</option>}
                    <option value="">-- Seleccione --</option>
                    {provs.map((p, i) => {
                      const id = getProvId(p);
                      const label = p.nombre ?? p.Nombre ?? p.titulo ?? "—";
                      return <option key={id || `prov-${i}`} value={id}>{label}</option>;
                    })}
                  </select>
                  <ChevronDown />
                </div>
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs md:text-sm text-white/80">Categoría</label>
                  <button
                    type="button"
                    onClick={handleNewCat}
                    className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white"
                  >
                    + nueva
                  </button>
                </div>

                <div className="relative">
                  <select
                    className={`${baseInput} appearance-none pr-10`}
                    value={normId(form.categoriaId)}
                    onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                    onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                    onChange={(e)=>setForm(s=>({ ...s, categoriaId: normId(e.target.value) }))}
                  >
                    {!cats.some(c =>
                      normId(
                        c?.id ?? c?.categoriaId ?? c?.CategoriaId ?? c?.IdCategoria ?? c?.categoria?.id
                      ) === normId(form.categoriaId)
                    ) && normId(form.categoriaId) && (
                      <option value={normId(form.categoriaId)}>
                        {
                          cats.find(c =>
                            normId(
                              c?.id ?? c?.categoriaId ?? c?.CategoriaId ?? c?.IdCategoria ?? c?.categoria?.id
                            ) === normId(form.categoriaId)
                          )?.nombre
                          ?? cats.find(c =>
                            normId(
                              c?.id ?? c?.categoriaId ?? c?.CategoriaId ?? c?.IdCategoria ?? c?.categoria?.id
                            ) === normId(form.categoriaId)
                          )?.titulo
                          ?? "Categoría nueva"
                        }
                      </option>
                    )}

                    <option value="">-- Seleccione --</option>

                    {cats.map((c, i) => {
                      const raw = c?.id ?? c?.categoriaId ?? c?.CategoriaId ?? c?.IdCategoria ?? c?.categoria?.id;
                      const val = normId(raw);
                      const label = c.nombre ?? c.Nombre ?? c.titulo ?? "—";
                      return <option key={val || `cat-${i}`} value={val}>{label}</option>;
                    })}
                  </select>
                  <ChevronDown />
                </div>
              </div>
            </div>
          </section>

          {/* Imagen */}
          <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
            <h3 className="font-semibold">Imagen</h3>
            <FileUpload fileUrl={preview} onPick={onPick} />
            <div className="mt-2 aspect-video bg-neutral-800 rounded-xl grid place-items-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-white/50 text-xs md:text-sm text-white/80">Sin imagen</div>
              )}
            </div>
          </section>
                    {/* Galería de imágenes adicionales (solo en modo editar) */}
          {beneficioId && (
            <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Galería</h3>
                <MultiFileUpload onPickMany={handleUploadMany} />
                {imgsLoading && (
                  <span className="text-xs text-white/50">Cargando fotos…</span>
                )}
              </div>

              {/* Skeleton mientras carga */}
              {imgsLoading && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-xl bg-neutral-800/80 animate-pulse flex-shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {!imgsLoading && imgsErr && (
                <p className="text-xs text-red-400">
                  No se pudieron cargar las imágenes adicionales.
                </p>
              )}

              {/* Sin imágenes */}
              {!imgsLoading && !imgsErr && imagenes.length === 0 && (
                <p className="text-xs text-white/50">
                  Este beneficio aún no tiene fotos adicionales.
                </p>
              )}

              {/* Lista de miniaturas */}
              {!imgsLoading && !imgsErr && imagenes.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {imagenes.map((img) => {
                    const src = normalizeImage(
                      img?.imagenBase64 ?? img?.imagen ?? img?.url ?? img?.imagenUrl
                    );
                    if (!src) return null;

                    const isActive = src === preview;

                    return (
                      <button
                        key={img.id ?? img.imagenId ?? src}
                        type="button"
                        onClick={() => handleSelectGalleryImage(img)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border
                          ${isActive
                            ? "border-emerald-400 ring-2 ring-emerald-500/60"
                            : "border-white/15 hover:border-emerald-400/70"} 
                        `}
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="text-[11px] text-white/40">
                Puedes subir más fotos desde la vista de galería avanzada más adelante;
                aquí solo las ves como una “historia” y eliges cuál será la principal.
              </p>
            </section>
          )}

          {/* Descripción y condiciones */}
          <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
            <h3 className="font-semibold">Descripción y condiciones</h3>

            <div className="space-y-2">
              <label className="text-xs md:text-sm text-white/80">Descripción</label>
              <textarea
                className={baseInput}
                rows={4}
                value={form.descripcion}
                onChange={e=>setForm(s=>({...s, descripcion:e.target.value}))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm text-white/80">Condiciones</label>
              <textarea
                className={baseInput}
                rows={3}
                value={form.condiciones}
                onChange={e=>setForm(s=>({...s, condiciones:e.target.value}))}
              />
            </div>

            {/* Vigencia */}
<section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
  <h3 className="font-semibold">Vigencia</h3>

  <div className="grid gap-2 grid-cols-2 max-sm:grid-cols-2">
    {/* Inicio */}
    <div className="space-y-1">
      <label className="text-xs text-white/70">Inicio</label>
      <input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        className={`${baseInput} text-sm py-2 px-3 max-w-[11rem]`}
        value={form.vigenciaInicio}
        onChange={e =>
          setForm(s => ({ ...s, vigenciaInicio: e.target.value }))
        }
      />
    </div>

    {/* Fin */}
    <div className="space-y-1">
      <label className="text-xs text-white/70">Fin</label>
      <input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        className={`${baseInput} text-sm py-2 px-3 max-w-[11rem]`}
        value={form.vigenciaFin}
        onChange={e =>
          setForm(s => ({ ...s, vigenciaFin: e.target.value }))
        }
      />
    </div>
  </div>
</section>
          </section>
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
      viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.19l3.71-2.96a.75.75 0 1 1 .94 1.16l-4.24 3.38a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" clipRule="evenodd"/>
    </svg>
  );
}
