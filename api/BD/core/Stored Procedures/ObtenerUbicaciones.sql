

/* ===========================
   4) UBICACION – listar y por Id
   =========================== */
CREATE   PROCEDURE core.ObtenerUbicaciones
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UbicacionId, Provincia, Canton, Distrito, CreadoEn, ModificadoEn
    FROM core.Ubicacion
    ORDER BY Provincia, Canton, Distrito;
END