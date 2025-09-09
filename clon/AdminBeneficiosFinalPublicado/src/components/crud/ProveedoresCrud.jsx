import { useEffect, useState } from "react";
import { Api } from "../../services/api";
import { fileToBase64 } from "../../utils/fileToBase64";

const toNull = (s) => (s?.trim?.() ? s.trim() : null);

export default function ProveedoresCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    activo: true,
    imagenFile: null,
    imagen: null, // base64
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    activo: true,
    imagenFile: null,
    imagen: null, // base64
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
        tieneImagen: !!(x.imagen ?? x.Imagen), // si backend envía byte[] como base64
      }));
      setRows(mapped);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreateFile = async (file) => {
    setForm(v => ({ ...v, imagenFile: file }));
    const b64 = file ? await fileToBase64(file) : null;
    setForm(v => ({ ...v, imagen: b64 }));
  };
  const onEditFile = async (file) => {
    setEditForm(v => ({ ...v, imagenFile: file }));
    const b64 = file ? await fileToBase64(file) : null;
    setEditForm(v => ({ ...v, imagen: b64 }));
  };

  const canCreate = form.nombre.trim().length >= 3;
  const canSave = editForm.nombre.trim().length >= 3;

  const crear = async () => {
    if (!canCreate) return;
    setSaving(true); setError("");
    try {
      const payload = {
        nombre: form.nombre.trim(),
        correo: toNull(form.correo),
        telefono: toNull(form.telefono),
        direccion: toNull(form.direccion),
        activo: !!form.activo,
        imagen: form.imagen ?? null, // base64 -> byte[] en backend
      };
      await Api.proveedores.crear(payload);
      setForm({
        nombre: "", correo: "", telefono: "", direccion: "", activo: true, imagenFile: null, imagen: null
      });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setEditForm({
      nombre: r.nombre || "",
      correo: r.correo || "",
      telefono: r.telefono || "",
      direccion: r.direccion || "",
      activo: !!r.activo,
      imagenFile: null,
      imagen: null, // si no cambian la imagen, enviamos null para no tocarla
    });
  };

  const guardar = async () => {
    if (!canSave) return;
    setSaving(true); setError("");
    try {
      const payload = {
        nombre: editForm.nombre.trim(),
        correo: toNull(editForm.correo),
        telefono: toNull(editForm.telefono),
        direccion: toNull(editForm.direccion),
        activo: !!editForm.activo,
        imagen: editForm.imagen ?? null, // sólo si suben una nueva
      };
      await Api.proveedores.editar(editId, payload);
      setEditId(null);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar proveedor?")) return;
    setSaving(true); setError("");
    try {
      await Api.proveedores.eliminar(id);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Crear proveedor */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="mb-3 font-semibold">Crear proveedor</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <label className="md:col-span-3 text-sm">
            <span className="mb-1 block text-white/70">Nombre*</span>
            <input
              value={form.nombre}
              onChange={e => setForm(v => ({ ...v, nombre: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              placeholder="Proveedor S.A."
            />
          </label>
          <label className="md:col-span-3 text-sm">
            <span className="mb-1 block text-white/70">Correo</span>
            <input
              value={form.correo}
              onChange={e => setForm(v => ({ ...v, correo: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              placeholder="correo@proveedor.com"
            />
          </label>
          <label className="md:col-span-2 text-sm">
            <span className="mb-1 block text-white/70">Teléfono</span>
            <input
              value={form.telefono}
              onChange={e => setForm(v => ({ ...v, telefono: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              placeholder="8888-8888"
            />
          </label>
          <label className="md:col-span-3 text-sm">
            <span className="mb-1 block text-white/70">Dirección</span>
            <input
              value={form.direccion}
              onChange={e => setForm(v => ({ ...v, direccion: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              placeholder="200 m sur de…"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.activo}
              onChange={e => setForm(v => ({ ...v, activo: e.target.checked }))} />
            Activo
          </label>
          <label className="md:col-span-2 text-sm">
            <span className="mb-1 block text-white/70">Logo/Imagen</span>
            <input type="file" accept="image/*"
              onChange={async e => {
                const f = e.target.files?.[0] || null;
                await onCreateFile(f);
              }}
              className="w-full text-sm"
            />
          </label>
          <div className="md:col-span-6">
            <button
              onClick={crear}
              disabled={!canCreate || saving}
              className="rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-3 py-2 text-sm font-medium"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </section>

      {/* Listado / edición */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold">Proveedores ({rows.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Correo</th>
                <th className="px-3 py-2 text-left">Teléfono</th>
                <th className="px-3 py-2 text-left">Dirección</th>
                <th className="px-3 py-2 text-left">Activo</th>
                <th className="px-3 py-2 text-left">Imagen</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-white/60">Cargando…</td></tr>
              ) : rows.length ? rows.map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input value={editForm.nombre}
                        onChange={e => setEditForm(v => ({ ...v, nombre: e.target.value }))}
                        className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1" />
                    ) : r.nombre}
                  </td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input value={editForm.correo}
                        onChange={e => setEditForm(v => ({ ...v, correo: e.target.value }))}
                        className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1" />
                    ) : r.correo}
                  </td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input value={editForm.telefono}
                        onChange={e => setEditForm(v => ({ ...v, telefono: e.target.value }))}
                        className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1" />
                    ) : r.telefono}
                  </td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input value={editForm.direccion}
                        onChange={e => setEditForm(v => ({ ...v, direccion: e.target.value }))}
                        className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1" />
                    ) : r.direccion}
                  </td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input type="checkbox" checked={editForm.activo}
                        onChange={e => setEditForm(v => ({ ...v, activo: e.target.checked }))} />
                    ) : (r.activo ? "Sí" : "No")}
                  </td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input type="file" accept="image/*"
                        onChange={async e => {
                          const f = e.target.files?.[0] || null;
                          await onEditFile(f);
                        }}
                        className="w-full text-sm"
                      />
                    ) : (r.tieneImagen ? "✅" : "—")}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    {editId === r.id ? (
                      <>
                        <button onClick={guardar} disabled={!canSave || saving}
                          className="rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-3 py-1.5">
                          Guardar
                        </button>
                        <button onClick={() => setEditId(null)}
                          className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5">
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(r)}
                          className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5">
                          Editar
                        </button>
                        <button onClick={() => eliminar(r.id)}
                          className="rounded-lg bg-red-500/80 hover:bg-red-500 px-3 py-1.5">
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-white/60">Sin proveedores</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
