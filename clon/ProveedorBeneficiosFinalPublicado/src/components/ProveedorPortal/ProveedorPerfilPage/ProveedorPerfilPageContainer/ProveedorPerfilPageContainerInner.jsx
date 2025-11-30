// src/pages/ProveedorPortal/ProveedorPerfilPage/ProveedorPerfilPageContainer/ProveedorPerfilPageContainerInner.jsx

import usePerfilProveedorPageContainer from "./usePerfilProveedorPageContainer";
import ProveedorPerfilPageView from "./ProveedorPerfilPageView";

export default function ProveedorPerfilPageContainerInner() {
  const { loading, error, form, handleChange, submit } =
    usePerfilProveedorPageContainer();

  return (
    <ProveedorPerfilPageView
      loading={loading}
      error={error}
      form={form}
      onChange={handleChange}
      onSubmit={submit}
    />
  );
}
