
-- Obtener por Id
CREATE   PROCEDURE core.ObtenerProveedor
  @ProveedorId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  SELECT ProveedorId, Nombre, Correo, Telefono, Activo, Imagen, Direccion, CreadoEn, ModificadoEn
  FROM core.Proveedor
  WHERE ProveedorId = @ProveedorId;
END