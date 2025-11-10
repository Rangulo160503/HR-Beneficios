// src/components/FormModal.jsx
import { useEffect, useRef, useState } from "react";

export default function FormModal({
  isOpen,
  onClose,
  postUrl,              // p.ej. `${import.meta.env.VITE_API_URL}/api/Contacto`
  onSubmitted,          // callback opcional con la respuesta del backend
  defaultValues = {
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: ""
  }
}) {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  // Abrir: reset, bloquear scroll, autofocus
  useEffect(() => {
    if (!isOpen) return;
    setForm(defaultValues);
    setErrors({});
    setSubmitting(false);
    document.body.style.overflow = "hidden";
    setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, defaultValues]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleChange = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const validate = () => {
    const e = {};
    // Nombre
    if (!form.nombre?.trim()) e.nombre = "Requerido";
    // Correo
    if (!form.correo?.trim()) e.correo = "Requerido";
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.correo.trim())) e.correo = "Correo inválido";
    }
    // Teléfono (opcional pero validable si viene)
    if (form.telefono?.trim()) {
      const onlyDigits = form.telefono.replace(/[^\d+]/g, "");
      if (onlyDigits.length < 8) e.telefono = "Teléfono inválido";
    }
    // Mensaje
    if (!form.mensaje?.trim()) e.mensaje = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Error ${res.status}`);
      }
      const data = await res.json().catch(() => ({}));
      onSubmitted?.(data);
      onClose?.();
    } catch (err) {
      setErrors(s => ({ ...s, _server: err.message || "No se pudo enviar el formulario" }));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();  // clic en overlay cierra
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[90vw] max-w-[520px] rounded-xl bg-white p-5 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()} // evita cierre por burbujeo
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">Contacto</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded p-2 text-black/70 hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {errors._server && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {errors._server}
          </div>
        )}

        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-black/80">Nombre completo</span>
            <input
              ref={firstInputRef}
              className="rounded border px-3 py-2"
              placeholder="Ej. Juan Pérez"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
            {errors.nombre && <small className="text-red-600">{errors.nombre}</small>}
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-black/80">Correo electrónico</span>
            <input
              className="rounded border px-3 py-2"
              placeholder="nombre@dominio.com"
              value={form.correo}
              onChange={(e) => handleChange("correo", e.target.value)}
              inputMode="email"
            />
            {errors.correo && <small className="text-red-600">{errors.correo}</small>}
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-black/80">Teléfono (opcional)</span>
            <input
              className="rounded border px-3 py-2"
              placeholder="+506 8888 8888"
              value={form.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              inputMode="tel"
            />
            {errors.telefono && <small className="text-red-600">{errors.telefono}</small>}
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-black/80">Mensaje</span>
            <textarea
              className="min-h-[96px] rounded border px-3 py-2"
              placeholder="Contanos cómo te ayudamos…"
              value={form.mensaje}
              onChange={(e) => handleChange("mensaje", e.target.value)}
            />
            {errors.mensaje && <small className="text-red-600">{errors.mensaje}</small>}
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-4 py-2 text-black hover:bg-black/5"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
