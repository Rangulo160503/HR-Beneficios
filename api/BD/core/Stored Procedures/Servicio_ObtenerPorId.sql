
CREATE   PROCEDURE core.Servicio_ObtenerPorId
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, Descripcion, CreadoEn, ModificadoEn
    FROM core.Servicio
    WHERE Id = @Id;
END