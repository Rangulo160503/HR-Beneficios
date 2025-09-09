// src/components/crud/ProveedoresCrud.jsx
import { useEffect, useState } from "react";
import { Api } from "../../services/api";

const toNull = (s) => (s?.trim?.() ? s.trim() : null);

export default function ProveedoresCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⬅️ ahora incluimos todos los campos
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    activo: true,
    // imagen: null // si luego subes archivo, aquí irá un ArrayBuffer/Base64
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    activo: true,
  });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await Api.proveedores.listar();
      const mapped = (data || []).map((x) => ({
        id: x.proveedorId ?? x.ProveedorId ?? x.id ?? x.Id,
        nombre: x.nombre ?? x.Nombre ?? "",
        correo: x.correo ?? x.Correo ?? "",
        telefono: x.telefono ?? x.Telefono ?? "",
        direccion: x.direccion ?? x.Direccion ?? "",
        activo: (x.activo ?? x.Activo ?? true) === true,
      }));
      setRows(mapped);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const crear = async () => {
    const payload = {
      nombre: form.nombre.trim(),
      correo: toNull(form.correo),
      telefono: toNull(form.telefono),
      direccion: toNull(form.direccion),
      activo: !!form.activo,
      imagen: null, // por ahora
    };
    if (!payload.nombre) return;
    await Api.proveedores.crear(payload);
    setForm({ nombre: "", correo: "", telefono: "", direccion: "", activo: true });
    load();
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setEditForm({
      nombre: r.nombre || "",
      correo: r.correo || "",
      telefono: r.telefono || "",
      direccion: r.direccion || "",
      activo: !!r.activo,
    });
  };

  const guardar = async () => {
    const payload = {
      nombre: editForm.nombre.trim(),
      correo: toNull(editForm.correo),
      telefono: toNull(editForm.telefono),
      direccion: toNull(editForm.direccion),
      activo: !!editForm.activo,
      imagen: null,
    };
    if (!payload.nombre) return;
    await Api.proveedores.editar(editId, payload);
    setEditId(null);
    load();
  };

  const eliminar = async (id) => {
    if (confirm("¿Eliminar proveedor?")) {
      await Api.proveedores.eliminar(id);
      load();
    }
  };

  const canCreate = form.nombre.trim().length >= 3;
  const canSave = editForm.nombre.trim().length >= 3;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Crear */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="mb-3 font-semibold">Crear proveedor</h4>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
          <label className="sm:col-span-3 text-sm">
            <span className="mb-1 block text-white/70">Nombre*</span>
            <input value={form.nombre} onChange={e=>setForm(v=>({...v,nombre:e.target.value}))}
                   className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2" />
          </label>
          <label className="sm:col-span-3 text-sm">
            <span className="mb-1 block text-white/70">Correo</span>
            <input value={form.correo} onChange={e=>setForm(v=>({...v,correo:e.target.value}))}
                   className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2" />
          </label>
          <label className="sm:col-span-2 text-sm">
            <span className="mb-1 block text-white/70">Teléfono</span>
            <input value={form.telefono} onChange={e=>setForm(v=>({...v,telefono:e.target.value}))}
                   className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2" />
          </label>
          <label className="sm:col-span-3 text-sm">
            <span className="mb-1 block text-white/70">Dirección</span>
            <input value={form.direccion} onChange={e=>setForm(v=>({...v,direccion:e.target.value}))}
                   className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2" />
          </label>
          <label className="sm:col-span-1 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.activo}
                   onChange={e=>setForm(v=>({...v,activo:e.target.checked}))}/>
            Activo
          </label>
          <div className="sm:col-span-6">
            <button onClick={crear} disabled={!canCreate}
              className="rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-3 py-2 text-sm font-medium">
              Guardar
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold">Listado ({rows.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-3 py-2 text-left">Id</th>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={3} className="px-3 py-8 text-center text-white/60">Cargando…</td></tr>
              ) : rows.length ? rows.map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input
                        value={editForm.nombre}
                        onChange={e => setEditForm(v => ({ ...v, nombre: e.target.value }))}
                        className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1"
                      />
                    ) : r.nombre}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    {editId === r.id ? (
                      <>
                        <button
                          onClick={guardar}
                          disabled={!canSave}
                          className="rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-3 py-1.5"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(r)}
                          className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(r.id)}
                          className="rounded-lg bg-red-500/80 hover:bg-red-500 px-3 py-1.5"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="px-3 py-8 text-center text-white/60">Sin proveedores</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
