
/* DELETE: usa ProductoId en el WHERE */
CREATE   PROCEDURE core.Producto_Eliminar
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM core.Producto
    WHERE ProductoId = @Id;               -- 👈 no 'Id'

    SELECT @Id AS EliminadoId;
END