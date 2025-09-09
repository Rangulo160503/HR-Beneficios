-- =============================================
-- Author:      <Tu Nombre>
-- Create date: <Fecha>
-- Description: Elimina un proveedor existente
-- =============================================
CREATE   PROCEDURE core.EliminarProveedor
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
        DELETE FROM core.Proveedor
         WHERE ProveedorId = @Id;

        SELECT @Id;
    COMMIT TRANSACTION;
END