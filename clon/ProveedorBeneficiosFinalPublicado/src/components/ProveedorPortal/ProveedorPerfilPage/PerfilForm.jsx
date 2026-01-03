// src/pages/ProveedorPortal/ProveedorPerfilPage/PerfilForm.jsx

export default function PerfilForm({ form, onChange, onSubmit }) {
  return (
    <form
      className="flex flex-col gap-4 max-w-lg"
      onSubmit={onSubmit}
    >
      <input
        className="input"
        name="nombre"
        value={form.nombre}
        onChange={onChange}
        placeholder="Nombre comercial"
      />

      <textarea
        className="textarea"
        name="descripcion"
        value={form.descripcion}
        onChange={onChange}
        placeholder="Descripción"
      />

      <input
        className="input"
        name="telefono"
        value={form.telefono}
        onChange={onChange}
        placeholder="Teléfono"
      />

      <input
        className="input"
        name="correo"
        value={form.correo}
        onChange={onChange}
        placeholder="Correo"
      />

      <input
        className="input"
        name="logo"
        value={form.logo}
        onChange={onChange}
        placeholder="URL del logo"
      />

      <button type="submit" className="btn-primary">
        Guardar cambios
      </button>
    </form>
  );
}
