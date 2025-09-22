import { useEffect, useRef, useState } from "react";
import FileUpload from "./FileUpload";

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
  const [preview, setPreview] = useState(() => form.imagenUrl || "");

  // archivo -> base64 (puro)
  function fileToBase64Pure(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => {
        const s = String(fr.result || "");
        const i = s.indexOf("base64,");
        res(i >= 0 ? s.slice(i + 7) : s);
      };
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

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
      setForm(s => ({ ...s, imagenUrl: "", imagenBase64: null }));
      return;
    }
    const base64 = await fileToBase64Pure(file);
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${base64}`;
    setPreview(dataUrl);
    setForm(s => ({ ...s, imagenUrl: dataUrl, imagenBase64: base64 }));
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
    "w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20";

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

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur">
      <div className="absolute inset-0 flex md:items-center md:justify-center">
        {/* Panel centrado */}
        <div className="relative w-full md:w-[920px] max-h-full md:max-h-[92vh]
                        bg-neutral-950 border-l md:border border-white/10
                        md:rounded-2xl overflow-hidden md:my-6 md:shadow-2xl">

          {/* Header */}
          <div className="h-14 px-4 flex items-center gap-3 bg-neutral-950/80 backdrop-blur border-b border-white/10">
            <button type="button" onClick={onCancel}
              className="rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-3 py-1.5">
              Cerrar
            </button>
            <div className="text-lg font-semibold flex-1">
              {initial ? "Editar beneficio" : "Nuevo beneficio"}
            </div>
            <button
              form="benef-form"
              className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white font-semibold px-4 py-2">
              Guardar
            </button>
          </div>

          {/* Área scrolleable */}
          <div
            ref={scrollerRef}
            className="overflow-auto max-h-[calc(100vh-56px)] md:max-h-[calc(92vh-56px)]"
          >
            <form id="benef-form" onSubmit={submit} className="p-4 md:p-6 space-y-4 text-[14px] md:text-base leading-6">
              {/* Datos principales */}
              <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
                <h3 className="font-semibold">Datos principales</h3>

                <div className="space-y-2">
                  <label className="text-sm">Título</label>
                  <input
                    className={baseInput}
                    value={form.titulo}
                    onChange={e=>setForm(s=>({...s, titulo:e.target.value}))}
                    required
                  />
                </div>

                <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
                  <div className="space-y-2">
                    <label className="text-sm">Precio (CRC)</label>
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
                      <label className="text-sm">Proveedor</label>
                      <button type="button" onClick={handleNewProv}
                        className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white">
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
                      <label className="text-sm">Categoría</label>
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
                        {/* opción fantasma si el id seleccionado aún no está en la lista */}
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
                    <div className="text-white/50 text-sm">Sin imagen</div>
                  )}
                </div>
              </section>

              {/* Descripción y condiciones */}
              <section className="rounded-2xl bg-neutral-900 border border-white/10 p-3 md:p-4 space-y-3">
                <h3 className="font-semibold">Descripción y condiciones</h3>

                <div className="space-y-2">
                  <label className="text-sm">Descripción</label>
                  <textarea
                    className={baseInput}
                    rows={4}
                    value={form.descripcion}
                    onChange={e=>setForm(s=>({...s, descripcion:e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Condiciones</label>
                  <textarea
                    className={baseInput}
                    rows={3}
                    value={form.condiciones}
                    onChange={e=>setForm(s=>({...s, condiciones:e.target.value}))}
                  />
                </div>

                <div className="grid gap-3 grid-cols-2 max-sm:grid-cols-1">
                  <div className="space-y-2">
                    <label className="text-sm">Vigencia inicio</label>
                    <input
                      type="date"
                      className={baseInput}
                      value={form.vigenciaInicio}
                      onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                      onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                      onChange={e=>setForm(s=>({...s, vigenciaInicio:e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Vigencia fin</label>
                    <input
                      type="date"
                      className={baseInput}
                      value={form.vigenciaFin}
                      onMouseDown={(e)=>revealBeforeOpen(e.currentTarget)}
                      onFocus={(e)=>revealBeforeOpen(e.currentTarget)}
                      onChange={e=>setForm(s=>({...s, vigenciaFin:e.target.value}))}
                    />
                  </div>
                </div>
              </section>
            </form>
          </div>
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
