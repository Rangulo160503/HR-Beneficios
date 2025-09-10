import { useEffect, useState } from "react";
import { Api } from "../../services/api";

/* === ESTILOS UNIFICADOS PARA BOTONES (mismo arte que inputs) === */
const btnBase =
  "rounded bg-neutral-800 border border-white/10 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed";
const btnSm = `${btnBase} px-2 py-1 text-xs font-medium`;
const btnMd = `${btnBase} px-3 py-2 text-sm font-medium`;

export default function CategoriasCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ nombre: "", activa: true });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", activa: true });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await Api.categorias.listar();
      const mapped = (data || []).map(x => {
        const id =
          x.categoriaId ?? x.CategoriaId ?? x.id ?? x.Id ?? null;
        return {
          id: id != null ? String(id) : null, // normaliza a string
          nombre: x.nombre ?? x.Nombre ?? "",
          activa: (x.activa ?? x.Activa ?? true) === true,
        };
      });
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
      await Api.categorias.crear({ nombre: form.nombre.trim(), activa: !!form.activa });
      setForm({ nombre: "", activa: true });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  // ✅ Robustecido: normaliza id a string y asegura valores del form
  const startEdit = (row) => {
    const rowId = row?.id != null ? String(row.id) : null;
    if (!rowId) return; // si por alguna razón no hay id, no entramos a edición
    setEditId(rowId);
    setEditForm({
      nombre: row?.nombre ?? "",
      activa: !!row?.activa,
    });
  };

  const guardar = async () => {
    if (!canSave) return;
    setSaving(true); setError("");
    try {
      await Api.categorias.editar(editId, {
        nombre: editForm.nombre.trim(),
        activa: !!editForm.activa
      });
      setEditId(null);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    setSaving(true); setError("");
    try {
      await Api.categorias.eliminar(id);
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
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
      )}

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="mb-3 font-semibold">Crear categoría</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <label className="md:col-span-4 text-sm">
            <span className="mb-1 block text-white/70">Nombre*</span>
            <input
              value={form.nombre}
              onChange={e => setForm(v => ({ ...v, nombre: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.activa}
              onChange={e => setForm(v => ({ ...v, activa: e.target.checked }))}
              className="accent-teal-500"
            />
            Activa
          </label>
          <div className="md:col-span-6">
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

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold">Categorías ({rows.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Activa</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={3} className="px-3 py-8 text-center text-white/60">Cargando…</td></tr>
              ) : rows.length ? rows.map(r => (
                <tr key={r.id ?? `row-${Math.random()}`} className="hover:bg-white/5">
                  <td className="px-3 py-2">
                    {editId === String(r.id) ? (
                      <input
                        value={editForm.nombre}
                        onChange={e => setEditForm(v => ({ ...v, nombre: e.target.value }))}
                        className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1"
                      />
                    ) : r.nombre}
                  </td>
                  <td className="px-3 py-2">
                    {editId === String(r.id) ? (
                      <input
                        type="checkbox"
                        checked={editForm.activa}
                        onChange={e => setEditForm(v => ({ ...v, activa: e.target.checked }))}
                        className="accent-teal-500"
                      />
                    ) : (r.activa ? "Sí" : "No")}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    {editId === String(r.id) ? (
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
                          onClick={() => startEdit(r)}  // ✅ ahora sí entra a edición de forma fiable
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
                <tr><td colSpan={3} className="px-3 py-8 text-center text-white/60">Sin categorías</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
