

/* ===========================
   3) SERVICIO – listar y por Id
   =========================== */
CREATE   PROCEDURE core.ObtenerServicios
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ServicioId, Nombre, Descripcion, CreadoEn, ModificadoEn
    FROM core.Servicio
    ORDER BY Nombre;
END