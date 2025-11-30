// src/pages/ProveedorPortal/ProveedorPerfilPage/ProveedorPerfilPageContainer/ProveedorPerfilPageView.jsx

import PerfilLoadingOrError from "../PerfilLoadingOrError";
import PerfilLayoutMain from "../PerfilLayoutMain";
import PerfilTitle from "../PerfilTitle";
import PerfilForm from "../PerfilForm";

export default function ProveedorPerfilPageView({
  loading,
  error,
  form,
  onChange,
  onSubmit,
}) {
  return (
    <PerfilLoadingOrError loading={loading} error={error}>
      <PerfilLayoutMain>
        <PerfilTitle />
        <PerfilForm form={form} onChange={onChange} onSubmit={onSubmit} />
      </PerfilLayoutMain>
    </PerfilLoadingOrError>
  );
}
