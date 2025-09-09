-- =============================================
-- Author:      <Tu Nombre>
-- Create date: <Fecha>
-- Description: Edita un proveedor existente
-- =============================================
CREATE   PROCEDURE core.EditarProveedor
    @Id         UNIQUEIDENTIFIER,
    @Nombre     NVARCHAR(200),
    @Correo     NVARCHAR(200) = NULL,
    @Telefono   NVARCHAR(50)  = NULL,
    @Activo     BIT           = 1,
    @Imagen     VARBINARY(MAX)= NULL,
    @Direccion  NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
        UPDATE core.Proveedor
           SET Nombre       = @Nombre,
               Correo       = @Correo,
               Telefono     = @Telefono,
               Activo       = @Activo,
               Imagen       = @Imagen,
               Direccion    = @Direccion,
               ModificadoEn = SYSDATETIME()
         WHERE ProveedorId  = @Id;

        SELECT @Id;
    COMMIT TRANSACTION;
END