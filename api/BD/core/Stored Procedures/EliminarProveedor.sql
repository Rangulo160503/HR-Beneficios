
-- Eliminar
CREATE   PROCEDURE core.EliminarProveedor
  @ProveedorId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  DELETE FROM core.Proveedor
  WHERE ProveedorId = @ProveedorId;
END