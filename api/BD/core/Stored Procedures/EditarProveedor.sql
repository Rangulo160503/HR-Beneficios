

/* SQL_STORED_PROCEDURE core.EditarProveedor */
/* =========================================================
   core.EditarProveedor (con AccessToken)
========================================================= */
CREATE   PROCEDURE [core].[EditarProveedor]
  @Id          UNIQUEIDENTIFIER,
  @Nombre      NVARCHAR(120),
  @Correo      NVARCHAR(120) = NULL,
  @Telefono    NVARCHAR(50)  = NULL,
  @Direccion   NVARCHAR(250) = NULL,
  @Imagen      VARBINARY(MAX)= NULL,
  @AccessToken VARCHAR(128)  = NULL
AS
BEGIN
  SET NOCOUNT ON;

  IF EXISTS (SELECT 1 FROM core.Proveedor WHERE Nombre = @Nombre AND ProveedorId <> @Id)
    THROW 50010, 'Nombre de proveedor ya existe.', 1;

  UPDATE p
     SET p.Nombre      = @Nombre,
         p.Correo      = @Correo,
         p.Telefono    = @Telefono,
         p.Direccion   = @Direccion,
         p.Imagen      = COALESCE(@Imagen, p.Imagen),
         p.AccessToken = @AccessToken
  FROM core.Proveedor p
  WHERE p.ProveedorId = @Id;

  IF @@ROWCOUNT = 0
    THROW 50011, 'Proveedor no existe.', 1;

  SELECT @Id AS ProveedorId;
END