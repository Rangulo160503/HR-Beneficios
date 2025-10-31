
CREATE   PROCEDURE core.Producto_ObtenerPorId
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, Descripcion, CreadoEn, ModificadoEn
    FROM core.Producto
    WHERE Id = @Id;
END