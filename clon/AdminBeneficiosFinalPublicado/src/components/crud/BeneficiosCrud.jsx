// src/components/crud/BeneficiosCrud.jsx
import { useEffect, useMemo, useState } from "react";
import { Api } from "../../services/api";

const EMPTY = {
  titulo: "",
  descripcion: "",
  precioCRC: "",
  proveedorId: "",
  categoriaId: "",
  imagen: null,          // ← CONSISTENTE con SP: Imagen (VARBINARY)
  condiciones: "",
  vigenciaInicio: "",
  vigenciaFin: "",
};

// util: File -> dataURL
const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

/* === ESTILOS === */
const btnBase =
  "rounded bg-neutral-800 border border-white/10 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed";
const btnSm = `${btnBase} px-2 py-1 text-xs font-medium`;
const btnMd = `${btnBase} px-3 py-2 text-sm font-medium`;

/* ====== Utils de imagen ====== */
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#1f2937'/>
          <stop offset='100%' stop-color='#374151'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <g fill='#9CA3AF' font-size='12' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>
        <text x='50%' y='50%'>Sin imagen</text>
      </g>
    </svg>`
  );

/** Normalizador (para mostrar en <img>) */
function normalizeImage(img) {
  if (!img) return "";
  if (typeof img === "string") {
    const s = img.trim();
    if (!s) return "";
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("blob:")) return s;
    const looksLikeB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
    if (looksLikeB64) return `data:image/jpeg;base64,${s.replace(/\s/g, "")}`;
    if (s.startsWith("/")) return s;
    return s;
  }
  if (Array.isArray(img)) {
    try {
      const uint = new Uint8Array(img);
      let binary = "";
      for (let i = 0; i < uint.length; i++) binary += String.fromCharCode(uint[i]);
      const b64 = btoa(binary);
      return `data:image/jpeg;base64,${b64}`;
    } catch {
      return "";
    }
  }
  return "";
}

/* Convertidor genérico a base64 “pelado” (para payload) */
function toBase64Raw(img) {
  if (!img) return null;
  if (typeof img === "string") {
    const s = img.trim();
    if (!s) return null;
    if (s.startsWith("data:")) {
      const parts = s.split(",");
      return parts[1] || null;
    }
    const looksLikeB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
    if (looksLikeB64) return s.replace(/\s/g, "");
    return null;
  }
  if (Array.isArray(img)) {
    try {
      const uint = new Uint8Array(img);
      let binary = "";
      for (let i = 0; i < uint.length; i++) binary += String.fromCharCode(uint[i]);
      return btoa(binary);
    } catch {
      return null;
    }
  }
  return null;
}

/* Evalúa si hay “imagen real” (no vacío/undefined) */
function hasRealImg(img) {
  if (!img) return false;
  if (typeof img === "string") return img.trim().length > 0;
  if (Array.isArray(img)) return img.length > 0;
  return false;
}

export default function BeneficiosCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // listas dinámicas
  const [cats, setCats] = useState([]);
  const [provs, setProvs] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaErr, setMetaErr] = useState("");

  const [imgPreview, setImgPreview] = useState("");         // preview CREAR
  const [imgPreviewEdit, setImgPreviewEdit] = useState(""); // preview EDITAR
  const [form, setForm] = useState({ ...EMPTY });

  const [editGuid, setEditGuid] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY, imagen: undefined }); // undefined => no tocar

  // ---------- Cargar listas de soporte
  const loadMeta = async () => {
    setMetaLoading(true); setMetaErr("");
    try {
      const [c, p] = await Promise.all([Api.categorias.listar(), Api.proveedores.listar()]);
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
      console.log("[BeneficiosCrud] Meta cargada:", { cats: catsMapped.length, provs: provsMapped.length });
    } catch (e) {
      setMetaErr(String(e?.message || e));
      console.error("[BeneficiosCrud] Error meta:", e);
    } finally {
      setMetaLoading(false);
    }
  };

  // ---------- Cargar beneficios (con _imgNorm y _hasRealImg)
  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await Api.beneficios.listar();
      const mapped = (data || []).map((x) => {
        const raw = x.imagen ?? x.Imagen ?? x.imagenUrl ?? x.ImagenUrl ?? null;
        const norm = normalizeImage(raw) || PLACEHOLDER;
        return {
          id: x.beneficioId ?? x.BeneficioId ?? x.id ?? x.Id,
          titulo: x.titulo ?? x.Titulo ?? "",
          descripcion: x.descripcion ?? x.Descripcion ?? "",
          condiciones: x.condiciones ?? x.Condiciones ?? "",
          categoriaId: x.categoriaId ?? x.CategoriaId ?? "",
          proveedorId: x.proveedorId ?? x.ProveedorId ?? "",
          vigenciaInicio: (x.vigenciaInicio ?? x.VigenciaInicio ?? "").slice?.(0,10) ?? "",
          vigenciaFin: (x.vigenciaFin ?? x.VigenciaFin ?? "").slice?.(0,10) ?? "",
          precioCRC: x.precioCRC ?? x.PrecioCRC ?? 0,
          imagen: raw,
          _imgNorm: norm,
          _hasRealImg: hasRealImg(raw),
        };
      });
      setRows(mapped);
      console.log("[BeneficiosCrud] Beneficios:", mapped);
      // si el id en edición ya no existe, cancelar edición
      setEditGuid(prev => (prev && !mapped.some(r => r.id === prev) ? null : prev));
      if (editGuid) {
        const current = mapped.find(r => r.id === editGuid);
        if (current) setImgPreviewEdit(current._imgNorm);
      }
    } catch (e) {
      setError(String(e?.message || e));
      console.error("[BeneficiosCrud] Error listar:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMeta(); }, []);
  useEffect(() => { load(); }, []);

  // ---------- Crear
  const canCreate = useMemo(() => {
    return (
      form.titulo.trim().length >= 3 &&
      form.descripcion.trim().length >= 3 &&
      !!form.categoriaId &&
      !!form.proveedorId &&
      form.vigenciaInicio &&
      form.vigenciaFin &&
      String(form.precioCRC).trim() !== ""
    );
  }, [form]);

  const crear = async () => {
    if (!canCreate || saving) return;
    setSaving(true); setError("");
    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        precioCRC: form.precioCRC === "" ? 0 : parseFloat(form.precioCRC),
        proveedorId: form.proveedorId || null,
        categoriaId: form.categoriaId || null,
        imagen: form.imagen || null,                 // ← nombre correcto para SP
        condiciones: form.condiciones?.trim() || null,
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFin: form.vigenciaFin,
      };
      console.log("[BeneficiosCrud] Crear payload:", {
        ...payload,
        imagen: payload.imagen ? `(base64 length: ${payload.imagen.length})` : null,
      });
      await Api.beneficios.crear(payload);
      setForm({ ...EMPTY });
      setImgPreview("");
      await load();
    } catch (e) {
      setError(String(e?.message || e));
      console.error("[BeneficiosCrud] Error crear:", e);
    } finally {
      setSaving(false);
    }
  };

  // ---------- Lazy fetch de imagen completa desde detalle (si el listado no la trae)
  const fetchImagenDetalle = async (id) => {
    try {
      const d = await Api.beneficios.obtener(id);
      const raw = d?.imagen ?? d?.Imagen ?? d?.imagenUrl ?? d?.ImagenUrl ?? null;
      const base64 = toBase64Raw(raw);
      const norm = normalizeImage(raw) || PLACEHOLDER;
      return { base64, norm };
    } catch (e) {
      console.warn("[BeneficiosCrud] No se pudo obtener imagen detalle:", e);
      return { base64: null, norm: PLACEHOLDER };
    }
  };

  // ---------- Editar
  const startEdit = async (r) => {
    setEditGuid(r.id);

    // Si el listado no trae imagen real, intentamos cargarla del detalle (lazy)
    let raw = r.imagen ?? null;
    let norm = r._imgNorm || PLACEHOLDER;
    let base64Actual = toBase64Raw(raw);

    if (!r._hasRealImg) {
      const det = await fetchImagenDetalle(r.id);
      if (det.base64) {
        base64Actual = det.base64;
        norm = det.norm;
        raw = `data:image/*;base64,${det.base64}`;
      }
    }

    setEditForm({
      ...EMPTY,
      titulo: r.titulo,
      descripcion: r.descripcion || "",
      condiciones: r.condiciones || "",
      categoriaId: r.categoriaId || "",
      proveedorId: r.proveedorId || "",
      vigenciaInicio: r.vigenciaInicio || "",
      vigenciaFin: r.vigenciaFin || "",
      precioCRC: String(r.precioCRC ?? ""),
      imagen: base64Actual ?? null, // string base64 o null
    });
    setImgPreviewEdit(norm);
  };

  const canSave = useMemo(() => {
    return (
      editForm.titulo.trim().length >= 3 &&
      editForm.descripcion?.trim().length >= 3 &&
      !!editForm.categoriaId &&
      !!editForm.proveedorId &&
      editForm.vigenciaInicio &&
      editForm.vigenciaFin &&
      String(editForm.precioCRC).trim() !== ""
    );
  }, [editForm]);

  const guardar = async () => {
    if (!canSave || saving) return;
    setSaving(true); setError("");
    try {
      const payload = {
        titulo: editForm.titulo.trim(),
        descripcion: editForm.descripcion?.trim() || "",
        precioCRC: editForm.precioCRC === "" ? 0 : parseFloat(editForm.precioCRC),
        proveedorId: editForm.proveedorId || null,
        categoriaId: editForm.categoriaId || null,
        condiciones: editForm.condiciones?.trim() || null,
        vigenciaInicio: editForm.vigenciaInicio,
        vigenciaFin: editForm.vigenciaFin,
      };

      // SIEMPRE enviar algo para Imagen (null para borrar, string base64 para guardar)
      if (editForm.imagen === "") {
        payload.imagen = null;
      } else if (typeof editForm.imagen === "string") {
        payload.imagen = editForm.imagen;
      } else if (Array.isArray(editForm.imagen)) {
        payload.imagen = toBase64Raw(editForm.imagen);
      } else if (editForm.imagen === null) {
        payload.imagen = null;
      } else {
        payload.imagen = null;
      }

      console.log("[BeneficiosCrud] Guardar payload:", {
        id: editGuid,
        ...payload,
        imagen:
          payload.imagen === null
            ? null
            : typeof payload.imagen === "string"
              ? `(base64 length: ${payload.imagen.length})`
              : payload.imagen === undefined
                ? undefined
                : payload.imagen,
      });
      await Api.beneficios.editar(editGuid, payload);
      setEditGuid(null);
      setImgPreviewEdit("");
      await load();
    } catch (e) {
      try {
        const errObj = await e.response?.json();
        if (errObj?.errors) {
          const [k, v] = Object.entries(errObj.errors)[0] || [];
          setError(`${k}: ${v?.[0] ?? "Error de validación"}`);
        } else {
          setError(String(e?.message || e));
        }
      } catch {
        setError(String(e?.message || e));
      }
      console.error("[BeneficiosCrud] Error editar:", e);
    } finally {
      setSaving(false);
    }
  };

  // ---------- Eliminar
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar beneficio?")) return;
    setSaving(true); setError("");
    try {
      console.log("[BeneficiosCrud] Eliminar:", id);
      await Api.beneficios.eliminar(id);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
      console.error("[BeneficiosCrud] Error eliminar:", e);
    } finally {
      setSaving(false);
    }
  };

  // ---------- Imagen (archivo → base64 “pelado”)
  const onFileChange = async (e, setTargetForm = setForm, setPreview = setImgPreview) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Selecciona una imagen válida");

    const url = URL.createObjectURL(file);
    setPreview(url);

    const dataUrl = await fileToDataUrl(file);   // "data:image/png;base64,AAAA..."
    const base64 = dataUrl.split(",")[1] ?? "";  // solo base64
    setTargetForm(v => ({ ...v, imagen: base64 }));
  };

  const quitarImagenEdicion = () => {
    // marcar para que el backend elimine la imagen (NULL)
    setEditForm(v => ({ ...v, imagen: "" }));
    setImgPreviewEdit("");
  };

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
            type="button"
            onClick={loadMeta}
            disabled={metaLoading || saving}
            className={btnSm}
            title="Refrescar catálogos"
          >
            {metaLoading ? "Cargando…" : "Recargar catálogos"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Título*</span>
            <input
              value={form.titulo}
              onChange={e => setForm(v => ({ ...v, titulo: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              placeholder="Ej. Limpieza dental + Flúor"
            />
          </label>

          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Precio CRC*</span>
            <input
              type="number"
              value={form.precioCRC}
              onChange={e => setForm(v => ({ ...v, precioCRC: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </label>

          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Proveedor*</span>
            <select
              value={form.proveedorId}
              onChange={e => setForm(v => ({ ...v, proveedorId: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              disabled={metaLoading}
            >
              <option value="">{metaLoading ? "Cargando proveedores…" : "Selecciona proveedor"}</option>
              {provs.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </label>

          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Categoría*</span>
            <select
              value={form.categoriaId}
              onChange={e => setForm(v => ({ ...v, categoriaId: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
              disabled={metaLoading}
            >
              <option value="">{metaLoading ? "Cargando categorías…" : "Selecciona categoría"}</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </label>

          <label className="sm:col-span-6 text-sm">
            <span className="block mb-1 text-white/70">Descripción*</span>
            <textarea
              value={form.descripcion}
              onChange={e => setForm(v => ({ ...v, descripcion: e.target.value }))}
              rows={3}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            />
          </label>

          <label className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Condiciones</span>
            <input
              value={form.condiciones}
              onChange={e => setForm(v => ({ ...v, condiciones: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1 text-white/70">Vigencia inicio*</span>
            <input
              type="date"
              value={form.vigenciaInicio}
              onChange={e => setForm(v => ({ ...v, vigenciaInicio: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1 text-white/70">Vigencia fin*</span>
            <input
              type="date"
              value={form.vigenciaFin}
              onChange={e => setForm(v => ({ ...v, vigenciaFin: e.target.value }))}
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2"
            />
          </label>

          {/* Imagen + preview (CREAR) */}
          <div className="sm:col-span-3 text-sm">
            <span className="block mb-1 text-white/70">Imagen (archivo)</span>
            <label htmlFor="imgFile" className={btnMd}>
              <span>Elegir imagen</span>
            </label>
            <input
              id="imgFile"
              type="file"
              accept="image/*"
              onChange={(e)=>onFileChange(e, setForm, setImgPreview)}
              className="sr-only"
            />
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

          <div className="sm:col-span-6">
            <button
              type="button"
              onClick={crear}
              disabled={!canCreate || metaLoading || saving}
              className={btnMd}
            >
              {saving ? "Guardando…" : "Guardar"}
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
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-3 py-2 text-left w-24">Id</th>
                <th className="px-3 py-2 text-left w-28">Imagen</th>
                <th className="px-3 py-2 text-left w-[18rem]">Título</th>
                <th className="px-3 py-2 text-left w-48">Proveedor</th>
                <th className="px-3 py-2 text-left w-48">Categoría</th>
                <th className="px-3 py-2 text-left w-[26rem]">Descripción</th>
                <th className="px-3 py-2 text-left w-64">Condiciones</th>
                <th className="px-3 py-2 text-left w-56">Vigencia</th>
                <th className="px-3 py-2 text-left w-28">Precio</th>
                <th className="px-3 py-2 text-right w-40">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={10} className="px-3 py-8 text-center text:white/60">Cargando…</td></tr>
              ) : rows.length ? rows.map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  {/* Id */}
                  <td className="px-3 py-2">
                    <span className="block truncate max-w-[6rem] font-mono text-xs" title={r.id}>
                      {r.id}
                    </span>
                  </td>

                  {/* Imagen */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-16 rounded overflow-hidden bg-white/5 shrink-0">
                          {imgPreviewEdit ? (
                            <img src={imgPreviewEdit} alt="" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-white/40 text-[10px]">Sin img</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <label className={btnSm}>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e)=>onFileChange(e, setEditForm, setImgPreviewEdit)}
                            />
                            Elegir
                          </label>
                          <button type="button" onClick={quitarImagenEdicion} className={btnSm}>
                            Quitar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded overflow-hidden bg-white/5">
                        {normalizeImage(r._imgNorm || r.imagen) ? (
                          <img
                            src={normalizeImage(r._imgNorm || r.imagen)}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <img src={PLACEHOLDER} alt="" className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </div>
                    )}
                  </td>

                  {/* Título */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <input
                        value={editForm.titulo}
                        onChange={e => setEditForm(v => ({ ...v, titulo: e.target.value }))}
                        className="w-full min-w-0 rounded bg-neutral-800 border border-white/10 px-2 py-1"
                      />
                    ) : <span className="block truncate">{r.titulo || "—"}</span>}
                  </td>

                  {/* Proveedor */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <select
                        value={editForm.proveedorId}
                        onChange={e => setEditForm(v => ({ ...v, proveedorId: e.target.value }))}
                        className="w-full min-w-0 rounded bg-neutral-800 border border-white/10 px-2 py-1"
                        disabled={metaLoading}
                      >
                        <option value="">{metaLoading ? "Cargando…" : "Selecciona"}</option>
                        {provs.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                      </select>
                    ) : (provs.find(p => p.id === r.proveedorId)?.nombre || "—")}
                  </td>

                  {/* Categoría */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <select
                        value={editForm.categoriaId}
                        onChange={e => setEditForm(v => ({ ...v, categoriaId: e.target.value }))}
                        className="w-full min-w-0 rounded bg-neutral-800 border border-white/10 px-2 py-1"
                        disabled={metaLoading}
                      >
                        <option value="">{metaLoading ? "Cargando…" : "Selecciona"}</option>
                        {cats.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    ) : (cats.find(c => c.id === r.categoriaId)?.nombre || "—")}
                  </td>

                  {/* Descripción */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <textarea
                        rows={2}
                        value={editForm.descripcion}
                        onChange={e => setEditForm(v => ({ ...v, descripcion: e.target.value }))}
                        className="w-full min-w-0 rounded bg-neutral-800 border border-white/10 px-2 py-1"
                      />
                    ) : (
                      <span className="block truncate" title={r.descripcion}>{r.descripcion || "—"}</span>
                    )}
                  </td>

                  {/* Condiciones */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <input
                        value={editForm.condiciones}
                        onChange={e => setEditForm(v => ({ ...v, condiciones: e.target.value }))}
                        className="w-full min-w-0 rounded bg-neutral-800 border border-white/10 px-2 py-1"
                      />
                    ) : (
                      <span className="block truncate" title={r.condiciones}>{r.condiciones || "—"}</span>
                    )}
                  </td>

                  {/* Vigencia */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    {editGuid === r.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={editForm.vigenciaInicio}
                          onChange={e => setEditForm(v => ({ ...v, vigenciaInicio: e.target.value }))}
                          className="rounded bg-neutral-800 border border-white/10 px-2 py-1"
                        />
                        <span>→</span>
                        <input
                          type="date"
                          value={editForm.vigenciaFin}
                          onChange={e => setEditForm(v => ({ ...v, vigenciaFin: e.target.value }))}
                          className="rounded bg-neutral-800 border border-white/10 px-2 py-1"
                        />
                      </div>
                    ) : (
                      (r.vigenciaInicio && r.vigenciaFin) ? `${r.vigenciaInicio} → ${r.vigenciaFin}` : "—"
                    )}
                  </td>

                  {/* Precio */}
                  <td className="px-3 py-2">
                    {editGuid === r.id ? (
                      <input
                        type="number"
                        value={editForm.precioCRC}
                        onChange={e => setEditForm(v => ({ ...v, precioCRC: e.target.value }))}
                        className="w-full min-w-0 rounded bg-neutral-800 border border-white/10 px-2 py-1"
                        min="0" step="0.01"
                      />
                    ) : Number(r.precioCRC ?? 0).toLocaleString()}
                  </td>

                  {/* Acciones */}
                  <td className="px-3 py-2 text-right">
                    {editGuid === r.id ? (
                      <>
                        <button type="button" onClick={guardar} disabled={!canSave || saving} className={`${btnSm} mr-2`}>
                          Guardar
                        </button>
                        <button type="button" onClick={() => { setEditGuid(null); setImgPreviewEdit(""); }} disabled={saving} className={btnSm}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEdit(r)} disabled={saving} className={`${btnSm} mr-2`}>
                          Editar
                        </button>
                        <button type="button" onClick={() => eliminar(r.id)} disabled={saving} className={btnSm}>
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={10} className="px-3 py-8 text-center text-white/60">Sin beneficios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
