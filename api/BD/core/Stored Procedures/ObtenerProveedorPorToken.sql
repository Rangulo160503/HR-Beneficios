

/* SQL_STORED_PROCEDURE core.ObtenerProveedorPorToken */
/* =========================================================
   core.ObtenerProveedorPorToken (NUEVA)
========================================================= */
CREATE   PROCEDURE [core].[ObtenerProveedorPorToken]
  @AccessToken VARCHAR(128)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT TOP 1
      p.ProveedorId,
      p.Nombre,
      p.Correo,
      p.Telefono,
      p.Direccion,
      p.Imagen,
      p.AccessToken
  FROM core.Proveedor p
  WHERE p.AccessToken = @AccessToken;
END
GO
