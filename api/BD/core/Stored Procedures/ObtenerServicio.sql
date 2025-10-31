
CREATE   PROCEDURE core.ObtenerServicio
    @ServicioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ServicioId, Nombre, Descripcion, CreadoEn, ModificadoEn
    FROM core.Servicio
    WHERE ServicioId = @ServicioId;
END