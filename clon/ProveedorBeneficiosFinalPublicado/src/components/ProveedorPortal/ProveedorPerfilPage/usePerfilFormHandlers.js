// src/pages/ProveedorPortal/ProveedorPerfilPage/usePerfilFormHandlers.js

export function usePerfilChangeHandler(form, setForm) {
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  return handleChange;
}

export function usePerfilSubmitHandler(savePerfil, form) {
  function submit(e) {
    if (e && e.preventDefault) e.preventDefault();
    savePerfil(form);
  }

  return submit;
}
