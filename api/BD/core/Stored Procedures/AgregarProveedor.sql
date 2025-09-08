
-- Agregar (devuelve el nuevo Id)
CREATE   PROCEDURE core.AgregarProveedor
  @Nombre NVARCHAR(200),
  @Correo NVARCHAR(200) = NULL,
  @Telefono NVARCHAR(50) = NULL,
  @Activo BIT = 1,
  @Imagen VARBINARY(MAX) = NULL,
  @Direccion NVARCHAR(500) = NULL,
  @NuevoId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  SET @NuevoId = NEWID();
  INSERT INTO core.Proveedor (ProveedorId, Nombre, Correo, Telefono, Activo, Imagen, Direccion, CreadoEn)
  VALUES (@NuevoId, @Nombre, @Correo, @Telefono, @Activo, @Imagen, @Direccion, SYSDATETIME());

  SELECT @NuevoId AS ProveedorId;
END