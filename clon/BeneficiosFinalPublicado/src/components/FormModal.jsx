// src/components/FormModal.jsx
import { useEffect, useRef, useState } from "react";
import { Api } from "../services/api";
import Toast from "./ui/Toast";

export default function FormModal({
  isOpen,
  onClose,
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
  const [toastOpen, setToastOpen] = useState(false);
  const firstInputRef = useRef(null);

  const successMessage = "¡Participación registrada!\nYa estás participando en la rifa";

  // Abrir: reset, bloquear scroll, autofocus
  useEffect(() => {
    if (!isOpen) return;
    setForm({ ...defaultValues });
    setErrors({});
    setSubmitting(false);
    document.body.style.overflow = "hidden";
    setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
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
    else if (form.nombre.trim().length < 3) e.nombre = "Mínimo 3 caracteres";
    // Correo
    if (!form.correo?.trim()) e.correo = "Requerido";
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.correo.trim())) e.correo = "Correo inválido";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const normalizeTelefono = (value) => {
    if (!value?.trim()) return null;
    const cleaned = value.replace(/\s+/g, "");
    const match = cleaned.match(/^\+?506?(\d{8})$/);
    if (match) return `+506${match[1]}`;
    return cleaned.replace(/(?!^)\+/g, "").replace(/[^\d+]/g, "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: normalizeTelefono(form.telefono),
        mensaje: form.mensaje?.trim() || null,
        source: "web",
      };
      const data = await Api.rifaParticipacion.crear(payload);
      onSubmitted?.(data);
      setToastOpen(true);
      onClose?.();
      setForm({ ...defaultValues });
    } catch (err) {
      setErrors(s => ({ ...s, _server: "No se pudo registrar tu participación. Intentá de nuevo." }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
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
            className="w-[90vw] max-w-[520px] rounded-xl bg-white p-5 text-slate-900 shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()} // evita cierre por burbujeo
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">Participar en rifa</h2>
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
                  className="rounded border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:text-slate-900 focus:placeholder:text-slate-500 disabled:text-slate-500 disabled:placeholder:text-slate-400"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                />
                {errors.nombre && <small className="text-red-600">{errors.nombre}</small>}
              </label>

              <label className="grid gap-1">
                <span className="text-sm text-black/80">Correo electrónico</span>
                <input
                  className="rounded border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:text-slate-900 focus:placeholder:text-slate-500 disabled:text-slate-500 disabled:placeholder:text-slate-400"
                  placeholder="nombre@dominio.com"
                  value={form.correo}
                  onChange={(e) => handleChange("correo", e.target.value)}
                  inputMode="email"
                />
                {errors.correo && <small className="text-red-600">{errors.correo}</small>}
              </label>

              <label className="grid gap-1">
                <span className="text-sm text-black/80">Teléfono</span>
                <input
                  className="rounded border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:text-slate-900 focus:placeholder:text-slate-500 disabled:text-slate-500 disabled:placeholder:text-slate-400"
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
                  className="min-h-[96px] rounded border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:text-slate-900 focus:placeholder:text-slate-500 disabled:text-slate-500 disabled:placeholder:text-slate-400"
                  placeholder="Contanos cómo te ayudamos…"
                  value={form.mensaje}
                  onChange={(e) => handleChange("mensaje", e.target.value)}
                />
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
                {submitting ? "Enviando…" : "Participar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <Toast
        open={toastOpen}
        message={successMessage}
        duration={3600}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
