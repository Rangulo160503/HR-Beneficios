CREATE PROCEDURE core.ExisteProveedor
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM core.Proveedor WHERE ProveedorId = @Id)
        SELECT 1 AS Existe;
    ELSE
        SELECT 0 AS Existe;
END