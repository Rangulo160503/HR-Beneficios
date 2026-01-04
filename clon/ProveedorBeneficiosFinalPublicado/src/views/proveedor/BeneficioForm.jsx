import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBeneficioForProveedor, getBeneficioDetail, updateBeneficio } from "../../core-config/useCases";
import { providerSessionStore } from "../../core-config/sessionStores";

export default function BeneficioForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseInput =
    "w-full rounded-xl bg-neutral-900/70 border border-white/15 px-3.5 py-2.5 text-sm md:text-base " +
    "placeholder:text-white/40 text-white " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 " +
    "transition-colors duration-150";

  // Valores por defecto (ajusta proveedorId/categoriaId reales)
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precioCRC: 0,
    condiciones: "",
    vigenciaInicio: "",
    vigenciaFin: "",
    proveedorId: "",   // puedes setearlo si lo sabes
    categoriaId: "",   // idem
    imagen: "",        // base64
  });
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (!isEdit) return;
    let cancel = false;
    (async () => {
      try {
        const dto = await getBeneficioDetail(id);
        if (cancel) return;
        setForm({
          titulo: dto.titulo || "",
          descripcion: dto.descripcion || "",
          precioCRC: dto.precioCRC ?? 0,
          condiciones: dto.condiciones || "",
          vigenciaInicio: (dto.vigenciaInicio || "").slice(0, 10), // yyyy-mm-dd
          vigenciaFin: (dto.vigenciaFin || "").slice(0, 10),
          proveedorId: dto.proveedorId || "",
          categoriaId: dto.categoriaId || "",
          imagen: dto.imagen || "",
        });
      } catch (e) {
        console.error(e);
        alert("No se pudo cargar el beneficio.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [id, isEdit]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // convertir archivo a base64
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buff = await file.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buff)));
    setForm(f => ({ ...f, imagen: b64 }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precioCRC: Number(form.precioCRC) || 0,
        condiciones: form.condiciones,
        vigenciaInicio: form.vigenciaInicio ? new Date(form.vigenciaInicio).toISOString() : null,
        vigenciaFin: form.vigenciaFin ? new Date(form.vigenciaFin).toISOString() : null,
        proveedorId: form.proveedorId || null,
        categoriaId: form.categoriaId || null,
        imagen: form.imagen || null, // base64 o null
      };

      if (isEdit) {
        await updateBeneficio({ beneficioId: id, dto: payload });
        alert("Beneficio actualizado");
        navigate(`/beneficios/${id}`);
      } else {
        const session = providerSessionStore.getSession();
        const proveedorId = session?.proveedorId;
        const token = session?.token;
        const creado = await createBeneficioForProveedor({
          proveedorId,
          token,
          dto: payload,
        });
        // si el API devuelve {id}/Guid, ajusta según tu respuesta
        const nuevoId = creado?.beneficioId || creado?.id || creado;
        alert("Beneficio creado");
        navigate(`/beneficios/${nuevoId || "beneficios"}`);
      }
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-zinc-200">Cargando…</div>;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur flex items-start justify-center md:items-center">
      <div className="w-full max-w-[920px] mx-2 my-3 md:my-6 bg-neutral-950 border border-white/10 md:rounded-2xl md:shadow-2xl flex flex-col max-h-[calc(100vh-1.5rem)] md:max-h-[92vh]">
        <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm md:text-base px-3 py-2 rounded-xl bg-neutral-900/80 border border-white/10 text-white hover:border-white/30 transition"
          >
            Cerrar
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base md:text-lg font-semibold text-white">
              {isEdit ? "Editar beneficio" : "Nuevo beneficio"}
            </h1>
          </div>
          <button
            type="submit"
            form="benef-form"
            disabled={saving}
            className="text-sm md:text-base px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            Guardar
          </button>
        </header>

        <div className="overflow-auto max-h-[calc(100svh-56px)] md:max-h-[calc(92vh-56px)]">
          <form id="benef-form" onSubmit={onSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="rounded-2xl bg-neutral-900/80 border border-white/10 shadow-lg shadow-black/40 p-3 md:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-base font-semibold text-white">Datos principales</h2>
              </div>
              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs md:text-sm text-white/80">Título</span>
                  <input
                    name="titulo"
                    value={form.titulo}
                    onChange={onChange}
                    className={baseInput}
                    required
                  />
                </label>

                <div className="grid md:grid-cols-3 gap-3">
                  <label className="block space-y-1 md:col-span-2">
                    <span className="text-xs md:text-sm text-white/80">Precio (CRC)</span>
                    <input
                      type="number"
                      name="precioCRC"
                      value={form.precioCRC}
                      onChange={onChange}
                      className={baseInput}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs md:text-sm text-white/80">Moneda</span>
                    <input
                      value="CRC"
                      disabled
                      className={`${baseInput} text-white/70`}
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <label className="block space-y-1">
                    <span className="text-xs md:text-sm text-white/80">ProveedorId</span>
                    <input
                      name="proveedorId"
                      value={form.proveedorId}
                      onChange={onChange}
                      className={baseInput}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs md:text-sm text-white/80">CategoriaId</span>
                    <input
                      name="categoriaId"
                      value={form.categoriaId}
                      onChange={onChange}
                      className={baseInput}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-900/80 border border-white/10 shadow-lg shadow-black/40 p-3 md:p-4 space-y-3">
              <h2 className="text-sm md:text-base font-semibold text-white">Imagen</h2>
              <label className="block space-y-1">
                <span className="text-xs md:text-sm text-white/80">Imagen (jpg/png)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFile}
                  className="text-sm text-white"
                />
              </label>
              <div className="aspect-video bg-neutral-800 rounded-xl grid place-items-center overflow-hidden">
                {form.imagen ? (
                  <img
                    src={`data:image/jpeg;base64,${form.imagen}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="text-xs md:text-sm text-white/50">Vista previa de la imagen</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="rounded-2xl bg-neutral-900/80 border border-white/10 shadow-lg shadow-black/40 p-3 md:p-4 space-y-3">
                <h2 className="text-sm md:text-base font-semibold text-white">Descripción</h2>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={onChange}
                  rows={5}
                  className={baseInput}
                />
              </div>

              <div className="rounded-2xl bg-neutral-900/80 border border-white/10 shadow-lg shadow-black/40 p-3 md:p-4 space-y-3">
                <h2 className="text-sm md:text-base font-semibold text-white">Condiciones</h2>
                <textarea
                  name="condiciones"
                  value={form.condiciones}
                  onChange={onChange}
                  rows={5}
                  className={baseInput}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-900/80 border border-white/10 shadow-lg shadow-black/40 p-3 md:p-4 space-y-3">
              <h2 className="text-sm md:text-base font-semibold text-white">Vigencia</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="text-xs md:text-sm text-white/80">Vigencia inicio</span>
                  <input
                    type="date"
                    name="vigenciaInicio"
                    value={form.vigenciaInicio}
                    onChange={onChange}
                    className={baseInput}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs md:text-sm text-white/80">Vigencia fin</span>
                  <input
                    type="date"
                    name="vigenciaFin"
                    value={form.vigenciaFin}
                    onChange={onChange}
                    className={baseInput}
                  />
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
