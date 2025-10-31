
CREATE   PROCEDURE core.ObtenerProducto
    @ProductoId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ProductoId, Nombre, Descripcion, CreadoEn, ModificadoEn
    FROM core.Producto
    WHERE ProductoId = @ProductoId;
END