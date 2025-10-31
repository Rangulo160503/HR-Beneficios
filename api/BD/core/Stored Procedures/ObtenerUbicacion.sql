
CREATE   PROCEDURE core.ObtenerUbicacion
    @UbicacionId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UbicacionId, Provincia, Canton, Distrito, CreadoEn, ModificadoEn
    FROM core.Ubicacion
    WHERE UbicacionId = @UbicacionId;
END