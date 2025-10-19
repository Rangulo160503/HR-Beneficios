CREATE PROCEDURE [core].[AgregarProveedor]
  @Nombre   NVARCHAR(120),
  @Correo   NVARCHAR(120) = NULL,
  @Telefono NVARCHAR(50)  = NULL,
  @Direccion NVARCHAR(250)= NULL,
  @Imagen   VARBINARY(MAX)= NULL
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Id UNIQUEIDENTIFIER =
    (SELECT ProveedorId FROM core.Proveedor WHERE Nombre = @Nombre);

  IF @Id IS NULL
  BEGIN
    SET @Id = NEWID();
    INSERT core.Proveedor (ProveedorId, Nombre, Correo, Telefono, Direccion, Imagen)
    VALUES (@Id, @Nombre, @Correo, @Telefono, @Direccion, @Imagen);
  END

  SELECT @Id AS ProveedorId;
END