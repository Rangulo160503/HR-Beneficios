
CREATE   PROCEDURE core.ObtenerProductos
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ProductoId, Nombre, Descripcion, CreadoEn, ModificadoEn
    FROM core.Producto
    ORDER BY Nombre;
END