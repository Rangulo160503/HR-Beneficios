import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Api } from "../../services/api";

export default function BeneficioForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

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
        const dto = await Api.beneficios.obtener(id);
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
        await Api.beneficios.editar(id, payload);
        alert("Beneficio actualizado");
        navigate(`/beneficios/${id}`);
      } else {
        const creado = await Api.beneficios.agregar(payload);
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
    <div className="p-6 text-zinc-200">
      <div className="mb-4 flex items-center gap-4">
        <Link to="/beneficios" className="text-emerald-400 hover:underline">← Volver</Link>
        <h1 className="text-xl font-semibold">{isEdit ? "Editar beneficio" : "Nuevo beneficio"}</h1>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm text-zinc-400">Título</span>
            <input name="titulo" value={form.titulo} onChange={onChange}
              className="w-full mt-1 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2" required />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Descripción</span>
            <textarea name="descripcion" value={form.descripcion} onChange={onChange} rows={4}
              className="w-full mt-1 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2" />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Condiciones</span>
            <textarea name="condiciones" value={form.condiciones} onChange={onChange} rows={3}
              className="w-full mt-1 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2" />
          </label>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-sm text-zinc-400">Precio (CRC)</span>
            <input type="number" name="precioCRC" value={form.precioCRC} onChange={onChange}
              className="w-full mt-1 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-zinc-400">Vigencia inicio</span>
              <input type="date" name="vigenciaInicio" value={form.vigenciaInicio} onChange={onChange}
                className="w-full mt-1 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm text-zinc-400">Vigencia fin</span>
              <input type="date" name="vigenciaFin" value={form.vigenciaFin} onChange={onChange}
                className="w-full mt-1 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-zinc-400">ProveedorId</span>
              <input name="proveedorId" value={form.proveedorId} onChange={onChange}
                className="w-full mt-1 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm text-zinc-400">CategoriaId</span>
              <input name="categoriaId" value={form.categoriaId} onChange={onChange}
                className="w-full mt-1 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2" />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-zinc-400">Imagen (jpg/png)</span>
            <input type="file" accept="image/*" onChange={onFile}
              className="w-full mt-1 text-sm" />
          </label>

          {form.imagen && (
            <div className="rounded overflow-hidden border border-zinc-800 bg-zinc-900">
              <img src={`data:image/jpeg;base64,${form.imagen}`} className="w-full object-cover" />
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button disabled={saving}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50">
            {isEdit ? "Guardar cambios" : "Crear beneficio"}
          </button>
          <Link to="/beneficios" className="px-4 py-2 rounded bg-zinc-800 text-zinc-100">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
