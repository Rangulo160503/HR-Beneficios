CREATE PROCEDURE core.ObtenerProveedorPorToken
  @AccessToken VARCHAR(128)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT TOP 1
    ProveedorId,
    Nombre,
    Correo,
    Telefono,
    Direccion,
    Imagen,
    AccessToken
  FROM core.Proveedor
  WHERE AccessToken = @AccessToken;
END;
GO
