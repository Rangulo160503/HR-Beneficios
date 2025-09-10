import { useEffect, useState } from "react";
import { Api } from "../../services/api";

const toNull = (s) => (s?.trim?.() ? s.trim() : null);

/* === ESTILOS UNIFICADOS PARA BOTONES (mismo arte que inputs de este archivo) === */
const btnBase =
  "rounded bg-neutral-900/70 border border-white/10 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/20";
const btnSm = `${btnBase} px-2 py-1 text-xs font-medium`;
const btnMd = `${btnBase} px-4 py-2 text-sm font-medium`;

function Badge({ children, tone = "green" }) {
  const map = {
    green: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20",
    gray: "bg-white/10 text-white/70 ring-1 ring-white/15",
    red: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${map[tone]}`}>
      {children}
    </span>
  );
}

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
      };
      await Api.proveedores.crear(payload);
      setForm({ nombre: "", correo: "", telefono: "", direccion: "", activo: true });
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Crear proveedor */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
        <div className="mb-4">
          <h4 className="font-semibold text-white">Crear proveedor</h4>
          <p className="text-xs text-white/60">Completa los campos mínimos y guarda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label className="md:col-span-6 text-sm">
            <span className="mb-1 block text-white/70">Nombre*</span>
            <input
              value={form.nombre}
              onChange={e => setForm(v => ({ ...v, nombre: e.target.value }))}
              className="w-full rounded-lg bg-neutral-900/70 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Proveedor S.A."
            />
          </label>
          <label className="md:col-span-6 text-sm">
            <span className="mb-1 block text-white/70">Correo</span>
            <input
              value={form.correo}
              onChange={e => setForm(v => ({ ...v, correo: e.target.value }))}
              className="w-full rounded-lg bg-neutral-900/70 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="correo@proveedor.com"
            />
          </label>

          <label className="md:col-span-4 text-sm">
            <span className="mb-1 block text-white/70">Teléfono</span>
            <input
              value={form.telefono}
              onChange={e => setForm(v => ({ ...v, telefono: e.target.value }))}
              className="w-full rounded-lg bg-neutral-900/70 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="8888-8888"
            />
          </label>
          <label className="md:col-span-8 text-sm">
            <span className="mb-1 block text-white/70">Dirección</span>
            <input
              value={form.direccion}
              onChange={e => setForm(v => ({ ...v, direccion: e.target.value }))}
              className="w-full rounded-lg bg-neutral-900/70 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="200 m sur de…"
            />
          </label>

          <div className="md:col-span-12 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={e => setForm(v => ({ ...v, activo: e.target.checked }))}
                className="accent-teal-500"
              />
              Activo
            </label>
          </div>

          <div className="md:col-span-12 flex justify-end pt-2">
            <button
              onClick={crear}
              disabled={!canCreate || saving}
              className={btnMd}
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </section>

      {/* Listado / edición */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Proveedores ({rows.length})</h4>
            <p className="text-xs text-white/60">Administra y edita los registros existentes.</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-3 py-2 text-left w-56">Nombre</th>
                <th className="px-3 py-2 text-left w-56">Correo</th>
                <th className="px-3 py-2 text-left w-40">Teléfono</th>
                <th className="px-3 py-2 text-left">Dirección</th>
                <th className="px-3 py-2 text-center w-20">Activo</th>
                <th className="px-3 py-2 text-right w-36">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={6} className="px-3 py-10 text-center text-white/60">Cargando…</td></tr>
              ) : rows.length ? rows.map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input
                        value={editForm.nombre}
                        onChange={e => setEditForm(v => ({ ...v, nombre: e.target.value }))}
                        className="w-full rounded bg-neutral-900/70 border border-white/10 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    ) : <span className="line-clamp-1">{r.nombre}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input
                        value={editForm.correo}
                        onChange={e => setEditForm(v => ({ ...v, correo: e.target.value }))}
                        className="w-full rounded bg-neutral-900/70 border border-white/10 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    ) : <span className="line-clamp-1">{r.correo}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input
                        value={editForm.telefono}
                        onChange={e => setEditForm(v => ({ ...v, telefono: e.target.value }))}
                        className="w-full rounded bg-neutral-900/70 border border-white/10 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    ) : r.telefono}
                  </td>
                  <td className="px-3 py-2">
                    {editId === r.id ? (
                      <input
                        value={editForm.direccion}
                        onChange={e => setEditForm(v => ({ ...v, direccion: e.target.value }))}
                        className="w-full rounded bg-neutral-900/70 border border-white/10 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    ) : <span className="line-clamp-1">{r.direccion}</span>}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {editId === r.id ? (
                      <input
                        type="checkbox"
                        checked={editForm.activo}
                        onChange={e => setEditForm(v => ({ ...v, activo: e.target.checked }))}
                        className="accent-teal-500"
                      />
                    ) : r.activo ? <Badge>Activo</Badge> : <Badge tone="gray">Inactivo</Badge>}
                  </td>
                  <td className="px-3 py-2 text-right space-x-1.5">
                    {editId === r.id ? (
                      <>
                        <button
                          onClick={guardar}
                          disabled={!canSave || saving}
                          className={btnSm}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className={btnSm}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(r)}
                          className={btnSm}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(r.id)}
                          className={btnSm}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-3 py-10 text-center text-white/60">Sin proveedores</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
