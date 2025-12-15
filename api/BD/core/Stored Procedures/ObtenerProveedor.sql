CREATE PROCEDURE [core].[ObtenerProveedor]
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
      p.ProveedorId,
      p.Nombre,
      p.Correo,
      p.Telefono,
      p.Direccion,
      p.Imagen,
      p.AccessToken,
      (SELECT COUNT(*)
         FROM core.Beneficio b
         WHERE b.ProveedorId = p.ProveedorId) AS CantidadBeneficios
  FROM core.Proveedor p
  WHERE p.ProveedorId = @Id;
END
