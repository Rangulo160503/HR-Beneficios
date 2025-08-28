// src/components/crud/CategoriasCrud.jsx
import { useEffect, useState } from "react";
import { Categorias } from "../../services/beneficiosService";

export default function CategoriasCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nombre: "", activa: true });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", activa: true });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await Categorias.listar();
      const mapped = data.map((x) => ({
        id: x.categoriaId ?? x.CategoriaId,
        nombre: x.nombre ?? x.Nombre,
        activa: x.activa ?? x.Activa,
      }));
      setRows(mapped);
    } catch (e) { setError(String(e.message || e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const crear = async () => {
    if (!form.nombre.trim()) return;
    await Categorias.crear({ nombre: form.nombre.trim(), activa: !!form.activa });
    setForm({ nombre: "", activa: true });
    load();
  };

  const startEdit = (r) => { setEditId(r.id); setEditForm({ nombre: r.nombre, activa: !!r.activa }); };
  const guardar = async () => {
    await Categorias.editar(editId, { nombre: editForm.nombre.trim(), activa: !!editForm.activa });
    setEditId(null);
    load();
  };
  const eliminar = async (id) => { if (confirm("¿Eliminar?")) { await Categorias.eliminar(id); load(); } };

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="mb-3 font-semibold">Crear categoría</h4>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
          <label className="sm:col-span-4 text-sm">
            <span className="mb-1 block text-white/70">Nombre</span>
            <input value={form.nombre} onChange={e=>setForm(v=>({...v,nombre:e.target.value}))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500" />
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.activa} onChange={e=>setForm(v=>({...v,activa:e.target.checked}))}/> Activa</label>
          <button onClick={crear} className="rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-2 text-sm font-medium">Guardar</button>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold">Listado ({rows.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr><th className="px-3 py-2 text-left">Id</th><th className="px-3 py-2 text-left">Nombre</th><th className="px-3 py-2 text-left">Activa</th><th className="px-3 py-2 text-right">Acciones</th></tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-white/60">Cargando…</td></tr>
              ) : rows.length ? rows.map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">
                    {editId===r.id ? (
                      <input value={editForm.nombre} onChange={e=>setEditForm(v=>({...v,nombre:e.target.value}))}
                        className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1" />
                    ) : r.nombre}
                  </td>
                  <td className="px-3 py-2">
                    {editId===r.id ? (
                      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!editForm.activa} onChange={e=>setEditForm(v=>({...v,activa:e.target.checked}))}/> Activa</label>
                    ) : (r.activa? "Sí":"No")}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    {editId===r.id ? (
                      <>
                        <button onClick={guardar} className="rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5">Guardar</button>
                        <button onClick={()=>setEditId(null)} className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={()=>startEdit(r)} className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5">Editar</button>
                        <button onClick={()=>eliminar(r.id)} className="rounded-lg bg-red-500/80 hover:bg-red-500 px-3 py-1.5">Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-white/60">Sin categorías</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
