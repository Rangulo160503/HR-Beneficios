// src/pages/ProveedorPortal/ProveedorPerfilPage/ProveedorPerfilPageContainer/usePerfilProveedorPageContainer.js

import usePerfilProveedor from "../usePerfilProveedor";
import usePerfilFormState from "../usePerfilFormState";
import useSyncPerfilToForm from "../useSyncPerfilToForm";
import {
  usePerfilChangeHandler,
  usePerfilSubmitHandler,
} from "../usePerfilFormHandlers";

export default function usePerfilProveedorPageContainer() {
  const { perfil, loading, error, savePerfil } = usePerfilProveedor();

  const { form, setForm } = usePerfilFormState();

  useSyncPerfilToForm(perfil, setForm);

  const handleChange = usePerfilChangeHandler(form, setForm);
  const submit = usePerfilSubmitHandler(savePerfil, form);

  return {
    loading,
    error,
    form,
    handleChange,
    submit,
  };
}
