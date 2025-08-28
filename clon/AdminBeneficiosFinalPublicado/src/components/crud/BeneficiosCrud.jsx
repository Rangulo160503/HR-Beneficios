// src/components/crud/BeneficiosCrud.jsx
import { useEffect, useState } from "react";
import { Beneficios } from "../../services/beneficiosService";

// Campos mínimos para crear/editar según tu API (strings para Estado/Origen)
const EMPTY = {
  titulo: "",
  descripcion: "",
  precioCRC: 0,
  proveedorId: 0,
  categoriaId: 0,
  imagenUrl: null,
  condiciones: "",
  vigenciaInicio: "",
  vigenciaFin: "",
  estado: "Borrador",
  disponible: true,
  origen: "manual",
};

export default function BeneficiosCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [form, setForm] = useState({ ...EMPTY });
  const [editGuid, setEditGuid] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await Beneficios.publicados();
      const mapped = data.map((x) => ({
        id: x.beneficioId ?? x.BeneficioId,
        titulo: x.titulo ?? x.Titulo,
        proveedor: x.proveedorNombre ?? x.ProveedorNombre,
        estado: x.estado ?? x.Estado,
        disponible: x.disponible ?? x.Disponible,
      }));
      setRows(mapped);
    } catch (e) { setError(String(e.message || e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const crear = async () => {
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      precioCRC: Number(form.precioCRC),
      proveedorId: Number(form.proveedorId),
      categoriaId: Number(form.categoriaId),
      imagenUrl: form.imagenUrl || null,
      condiciones: form.condiciones || null,
      vigenciaInicio: form.vigenciaInicio,
      vigenciaFin: form.vigenciaFin,
      estado: form.estado,
      disponible: !!form.disponible,
      origen: form.origen,
    };
    await Beneficios.crear(payload);
    setForm({ ...EMPTY });
    load();
  };

  const startEdit = async (r) => {
    setEditGuid(r.id);
    // podrías consultar detalle si lo necesitas
    setEditForm({ ...EMPTY, titulo: r.titulo, estado: r.estado, disponible: !!r.disponible });
  };

  const guardar = async () => {
    const payload = { ...editForm, precioCRC: Number(editForm.precioCRC), proveedorId: Number(editForm.proveedorId), categoriaId: Number(editForm.categoriaId), disponible: !!editForm.disponible };
    await Beneficios.editar(editGuid, payload);
    setEditGuid(null);
    load();
  };

  const eliminar = async (id) => { if (confirm("¿Eliminar beneficio?")) { await Beneficios.eliminar(id); load(); } };

  const onFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return alert("Selecciona una imagen");

  // Preview
  const url = URL.createObjectURL(file);
  setImgPreview(url);

  // A Base64 (lo que espera la API para byte[])
  const dataUrl = await fileToDataUrl(file);                 // ej: "data:image/png;base64,AAAA..."
  const base64 = dataUrl.split(",")[1] ?? "";                // solo la parte base64
  setForm(v => ({ ...v, imagenUrl: base64 }));
};

const fileToDataUrl = (file) =>
  new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="mb-3 font-semibold">Crear beneficio</h4>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <label className="sm:col-span-3 text-sm"><span className="block mb-1 text-white/70">Nombre del beneficio</span>
            <input value={form.titulo} onChange={e=>setForm(v=>({...v,titulo:e.target.value}))} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"/>
          </label>
          <label className="sm:col-span-3 text-sm"><span className="block mb-1 text-white/70">Precio CRC</span>
            <input type="number" value={form.precioCRC} onChange={e=>setForm(v=>({...v,precioCRC:e.target.value}))} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"/>
          </label>
          <label className="sm:col-span-3 text-sm"><span className="block mb-1 text-white/70">Proveedor</span>
            <input type="number" value={form.proveedorId} onChange={e=>setForm(v=>({...v,proveedorId:e.target.value}))} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"/>
          </label>
          <label className="sm:col-span-3 text-sm"><span className="block mb-1 text-white/70">Categoria</span>
            <input type="number" value={form.categoriaId} onChange={e=>setForm(v=>({...v,categoriaId:e.target.value}))} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"/>
          </label>
          <label className="sm:col-span-6 text-sm"><span className="block mb-1 text-white/70">Descripción</span>
            <textarea value={form.descripcion} onChange={e=>setForm(v=>({...v,descripcion:e.target.value}))} rows={3} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"/>
          </label>
          <div className="sm:col-span-3 text-sm">
  <span className="block mb-1 text-white/70">Imagen (archivo)</span>

  <label
    htmlFor="imgFile"
    className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2 cursor-pointer select-none"
  >
    <span>Elegir imagen</span>
  </label>

  <input id="imgFile" type="file" accept="image/*" onChange={onFileChange} className="sr-only" />
  {/* opcional: nombre o ayuda */}
  {/* <p className="mt-1 text-xs text-white/50">PNG/JPG, máx 2MB</p> */}
</div>

<div className="sm:col-span-3">
  <span className="block mb-1 text-white/70 text-sm">Vista previa</span>
  <div className="rounded-xl overflow-hidden bg-white/5 w-40 h-40">
    {imgPreview ? <img src={imgPreview} alt="" className="w-full h-full object-cover" /> : (
      <div className="w-full h-full grid place-items-center text-white/50">Sin imagen</div>
    )}
  </div>
</div>
          <label className="text-sm"><span className="block mb-1 text-white/70">Vigencia inicio</span>
            <input type="date" value={form.vigenciaInicio} onChange={e=>setForm(v=>({...v,vigenciaInicio:e.target.value}))} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"/>
          </label>
          <label className="text-sm"><span className="block mb-1 text-white/70">Vigencia fin</span>
            <input type="date" value={form.vigenciaFin} onChange={e=>setForm(v=>({...v,vigenciaFin:e.target.value}))} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"/>
          </label>
          <label className="text-sm"><span className="block mb-1 text-white/70">Estado</span>
            <select value={form.estado} onChange={e=>setForm(v=>({...v,estado:e.target.value}))} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2">
              <option>Borrador</option><option>Publicado</option><option>Inactivo</option><option>Archivado</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.disponible} onChange={e=>setForm(v=>({...v,disponible:e.target.checked}))}/> Disponible</label>
          <label className="text-sm"><span className="block mb-1 text-white/70">Origen</span>
            <select value={form.origen} onChange={e=>setForm(v=>({...v,origen:e.target.value}))} className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"><option>manual</option><option>email</option></select>
          </label>
          <div className="sm:col-span-6">
            <button onClick={crear} className="rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-2 text-sm font-medium">Guardar</button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between"><h4 className="font-semibold">Listado ({rows.length})</h4></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70"><tr><th className="px-3 py-2 text-left">Id</th><th className="px-3 py-2 text-left">Título</th><th className="px-3 py-2 text-left">Estado</th><th className="px-3 py-2 text-left">Disp.</th><th className="px-3 py-2 text-right">Acciones</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (<tr><td colSpan={5} className="px-3 py-8 text-center text-white/60">Cargando…</td></tr>) : rows.length ? rows.map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-3 py-2 align-middle">{r.id}</td>
                  <td className="px-3 py-2 align-middle">{editGuid===r.id ? (
                    <input value={editForm.titulo} onChange={e=>setEditForm(v=>({...v,titulo:e.target.value}))} className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1" />
                  ) : r.titulo}</td>
                  <td className="px-3 py-2 align-middle">{editGuid===r.id ? (
                    <select value={editForm.estado} onChange={e=>setEditForm(v=>({...v,estado:e.target.value}))} className="rounded bg-neutral-800 border border-white/10 px-2 py-1"><option>Borrador</option><option>Publicado</option><option>Inactivo</option><option>Archivado</option></select>
                  ) : r.estado}</td>
                  <td className="px-3 py-2 align-middle">{editGuid===r.id ? (
                    <input type="checkbox" checked={!!editForm.disponible} onChange={e=>setEditForm(v=>({...v,disponible:e.target.checked}))} />
                  ) : (r.disponible ? "Sí" : "No")}</td>
                  <td className="px-3 py-2 align-middle text-right space-x-2">
                    {editGuid===r.id ? (
                      <>
                        <button onClick={guardar} className="rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5">Guardar</button>
                        <button onClick={()=>setEditGuid(null)} className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={()=>startEdit(r)} className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5">Editar</button>
                        <button onClick={()=>eliminar(r.id)} className="rounded-lg bg-red-500/80 hover:bg-red-500 px-3 py-1.5">Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (<tr><td colSpan={5} className="px-3 py-8 text-center text-white/60">Sin beneficios</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
