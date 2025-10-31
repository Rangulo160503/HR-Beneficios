
CREATE   PROCEDURE core.Ubicacion_ObtenerPorId
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Provincia, Canton, Distrito, DireccionExacta, CreadoEn, ModificadoEn
    FROM core.Ubicacion
    WHERE Id = @Id;
END