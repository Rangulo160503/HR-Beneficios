// src/pages/ProveedorPortal/ProveedorPerfilPage/PerfilLoadingOrError.jsx

export default function PerfilLoadingOrError({ loading, error, children }) {
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar perfil</p>;

  return children;
}
