// src/components/crud/BeneficiosCrud.jsx
import { useEffect, useMemo, useState } from "react";
import { Api } from "../../services/api";

const EMPTY = {
  titulo: "",
  descripcion: "",
  precioCRC: "",
  proveedorId: "", // GUID string
  categoriaId: "", // GUID string
  imagenUrl: null, // base64 sin data:
  condiciones: "",
  vigenciaInicio: "",
  vigenciaFin: "",
  estado: "Borrador",
  disponible: true,
  origen: "manual",
};

// util: File -> dataURL
const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

export default function BeneficiosCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // listas dinámicas
  const [cats, setCats] = useState([]);
  const [provs, setProvs] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaErr, setMetaErr] = useState("");

  const [imgPreview, setImgPreview] = useState("");
  const [form, setForm] = useState({ ...EMPTY });

  const [editGuid, setEditGuid] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY });

  // ---------- Cargar listas de soporte (categorías, proveedores)
  const loadMeta = async () => {
    setMetaLoading(true); setMetaErr("");
    try {
      const [c, p] = await Promise.all([
        Api.categorias.listar(),
        Api.proveedores.listar(),
      ]);
      const catsMapped = (c || []).map(x => ({
        id: x.categoriaId ?? x.CategoriaId ?? x.id ?? x.Id,
        nombre: x.nombre ?? x.Nombre ?? x.titulo ?? x.Titulo ?? "",
      }));
      const provsMapped = (p || []).map(x => ({
        id: x.proveedorId ?? x.ProveedorId ?? x.id ?? x.Id,
        nombre: x.nombre ?? x.Nombre ?? "",
      }));
      setCats(catsMapped);
      setProvs(provsMapped);
    } catch (e) {
      setMetaErr(String(e?.message || e));
    } finally {
      setMetaLoading(false);
    }
  };

  // ---------- Cargar beneficios
  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await Api.beneficios.listar();
      const mapped = (data || []).map((x) => ({
        id: x.beneficioId ?? x.BeneficioId ?? x.id ?? x.Id,
        titulo: x.titulo ?? x.Titulo ?? "",
        estado: x.estado ?? x.Estado ?? "Borrador",
        disponible: (x.disponible ?? x.Disponible ?? true) === true,
        categoriaId: x.categoriaId ?? x.CategoriaId ?? "",
        proveedorId: x.proveedorId ?? x.ProveedorId ?? "",
      }));
      setRows(mapped);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMeta(); }, []);
  useEffect(() => { load(); }, []);

  // ---------- Crear
  const crear = async () => {
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      precioCRC: form.precioCRC === "" ? 0 : parseFloat(form.precioCRC),
      proveedorId: form.proveedorId || null,
      categoriaId: form.categoriaId || null,
      imagenUrl: form.imagenUrl || null,
      condiciones: form.condiciones || null,
      vigenciaInicio: form.vigenciaInicio || null,
      vigenciaFin: form.vigenciaFin || null,
      estado: form.estado,
      disponible: !!form.disponible,
      origen: form.origen,
    };
    await Api.beneficios.crear(payload);
    setForm({ ...EMPTY });
    setImgPreview("");
    load();
  };

  // ---------- Editar
  const startEdit = (r) => {
    setEditGuid(r.id);
    setEditForm({
      ...EMPTY,
      titulo: r.titulo,
      estado: r.estado,
      disponible: !!r.disponible,
      categoriaId: r.categoriaId || "",
      proveedorId: r.proveedorId || "",
    });
  };

  const guardar = async () => {
    const payload = {
      ...editForm,
      precioCRC: editForm.precioCRC === "" ? 0 : parseFloat(editForm.precioCRC),
      disponible: !!editForm.disponible,
    };
    await Api.beneficios.editar(editGuid, payload);
    setEditGuid(null);
    load();
  };

  // ---------- Eliminar
  const eliminar = async (id) => {
    if (confirm("¿Eliminar beneficio?")) {
      await Api.beneficios.eliminar(id);
      load();
    }
  };

  // ---------- Imagen
  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Selecciona una imagen válida");

    const url = URL.createObjectURL(file);
    setImgPreview(url);

    const dataUrl = await fileToDataUrl(file);   // "data:image/png;base64,AAAA..."
    const base64 = dataUrl.split(",")[1] ?? "";  // solo base64
    setForm(v => ({ ...v, imagenUrl: base64 }));
  };

  // ---------- Validaciones simples
  const canCreate = useMemo(() => {
    return (
      form.titulo.trim().length >= 3 &&
      form.descripcion.trim().length >= 3 &&
      !!form.categoriaId &&
      !!form.proveedorId
    );
  }, [form]);

  const canSave = useMemo(() => {
    return editForm.titulo.trim().length >= 3;
  }, [editForm]);

  return (
    <div className="space-y-6">
      {(error || metaErr) && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error || metaErr}
        </div>
      )}

      {/* CREAR */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h4 className="font-semibold">Crear beneficio</h4>
          <button
            onClick={loadMeta}
            className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm"
            title="Refrescar catálogos"
          >
            Recargar catálogos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Nombre del beneficio</span>
            <input
              value={form.titulo}
              onChange={e => setForm(v => ({ ...v, titulo: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              placeholder="Ej. Limpieza dental + Fluor"
            />
          </label>

          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Precio CRC</span>
            <input
              type="number"
              value={form.precioCRC}
              onChange={e => setForm(v => ({ ...v, precioCRC: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </label>

          {/* Proveedor (select) */}
          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Proveedor</span>
            <select
              value={form.proveedorId}
              onChange={e => setForm(v => ({ ...v, proveedorId: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              disabled={metaLoading}
            >
              <option value="">{metaLoading ? "Cargando proveedores…" : "Selecciona proveedor"}</option>
              {provs.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </label>

          {/* Categoría (select) */}
          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Categoría</span>
            <select
              value={form.categoriaId}
              onChange={e => setForm(v => ({ ...v, categoriaId: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              disabled={metaLoading}
            >
              <option value="">{metaLoading ? "Cargando categorías…" : "Selecciona categoría"}</option>
              {cats.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </label>

          <label className="sm:col-span-6 text-sm">
            <span className="block mb-1 text-white/70">Descripción</span>
            <textarea
              value={form.descripcion}
              onChange={e => setForm(v => ({ ...v, descripcion: e.target.value }))}
              rows={3}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            />
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
          </div>

          <div className="sm:col-span-3">
            <span className="block mb-1 text-white/70 text-sm">Vista previa</span>
            <div className="rounded-xl overflow-hidden bg-white/5 w-40 h-40">
              {imgPreview ? (
                <img src={imgPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-white/50">Sin imagen</div>
              )}
            </div>
          </div>

          <label className="text-sm">
            <span className="block mb-1 text-white/70">Vigencia inicio</span>
            <input
              type="date"
              value={form.vigenciaInicio}
              onChange={e => setForm(v => ({ ...v, vigenciaInicio: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1 text-white/70">Vigencia fin</span>
            <input
              type="date"
              value={form.vigenciaFin}
              onChange={e => setForm(v => ({ ...v, vigenciaFin: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1 text-white/70">Estado</span>
            <select
              value={form.estado}
              onChange={e => setForm(v => ({ ...v, estado: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            >
              <option>Borrador</option>
              <option>Publicado</option>
              <option>Inactivo</option>
              <option>Archivado</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.disponible}
              onChange={e => setForm(v => ({ ...v, disponible: e.target.checked }))}
            /> Disponible
          </label>

          <label className="text-sm">
            <span className="block mb-1 text-white/70">Origen</span>
            <select
              value={form.origen}
              onChange={e => setForm(v => ({ ...v, origen: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            >
              <option>manual</option>
              <option>email</option>
            </select>
          </label>

          <div className="sm:col-span-6">
            <button
              onClick={crear}
              disabled={!canCreate || metaLoading}
              className="rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-3 py-2 text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
      </section>

      {/* LISTADO */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold">Listado ({rows.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-3 py-2 text-left">Id</th>
                <th className="px-3 py-2 text-left">Título</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Disp.</th>
                <th className="px-3 py-2 text-left">Proveedor</th>
                <th className="px-3 py-2 text-left">Categoría</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-white/60">Cargando…</td></tr>
              ) : rows.length ? rows.map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <input
                        value={editForm.titulo}
                        onChange={e => setEditForm(v => ({ ...v, titulo: e.target.value }))}
                        className="w-full rounded bg-neutral-800 border border-white/10 px-2 py-1"
                      />
                    ) : r.titulo}
                  </td>
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <select
                        value={editForm.estado}
                        onChange={e => setEditForm(v => ({ ...v, estado: e.target.value }))}
                        className="rounded bg-neutral-800 border border-white/10 px-2 py-1"
                      >
                        <option>Borrador</option>
                        <option>Publicado</option>
                        <option>Inactivo</option>
                        <option>Archivado</option>
                      </select>
                    ) : r.estado}
                  </td>
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <input
                        type="checkbox"
                        checked={!!editForm.disponible}
                        onChange={e => setEditForm(v => ({ ...v, disponible: e.target.checked }))}
                      />
                    ) : (r.disponible ? "Sí" : "No")}
                  </td>

                  {/* Proveedor select en edición */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <select
                        value={editForm.proveedorId}
                        onChange={e => setEditForm(v => ({ ...v, proveedorId: e.target.value }))}
                        className="rounded bg-neutral-800 border border-white/10 px-2 py-1"
                        disabled={metaLoading}
                      >
                        <option value="">{metaLoading ? "Cargando…" : "Selecciona"}</option>
                        {provs.map(p => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </select>
                    ) : (provs.find(p => p.id === r.proveedorId)?.nombre || "—")}
                  </td>

                  {/* Categoría select en edición */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <select
                        value={editForm.categoriaId}
                        onChange={e => setEditForm(v => ({ ...v, categoriaId: e.target.value }))}
                        className="rounded bg-neutral-800 border border-white/10 px-2 py-1"
                        disabled={metaLoading}
                      >
                        <option value="">{metaLoading ? "Cargando…" : "Selecciona"}</option>
                        {cats.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                      </select>
                    ) : (cats.find(c => c.id === r.categoriaId)?.nombre || "—")}
                  </td>

                  <td className="px-3 py-2 text-right space-x-2">
                    {editGuid === r.id ? (
                      <>
                        <button
                          onClick={guardar}
                          disabled={!canSave}
                          className="rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-3 py-1.5"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditGuid(null)}
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
                <tr><td colSpan={7} className="px-3 py-8 text-center text-white/60">Sin beneficios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
