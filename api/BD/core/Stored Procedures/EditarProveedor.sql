
-- Editar
CREATE   PROCEDURE core.EditarProveedor
  @ProveedorId UNIQUEIDENTIFIER,
  @Nombre NVARCHAR(200),
  @Correo NVARCHAR(200) = NULL,
  @Telefono NVARCHAR(50) = NULL,
  @Activo BIT = 1,
  @Imagen VARBINARY(MAX) = NULL,
  @Direccion NVARCHAR(500) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE core.Proveedor
  SET Nombre = @Nombre,
      Correo = @Correo,
      Telefono = @Telefono,
      Activo = @Activo,
      Imagen = @Imagen,
      Direccion = @Direccion,
      ModificadoEn = SYSDATETIME()
  WHERE ProveedorId = @ProveedorId;
END