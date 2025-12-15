
/* ============================
   ACTUALIZAR ESTADO (GUID)
============================ */
CREATE   PROCEDURE core.RifaParticipacion_ActualizarEstado
    @Id UNIQUEIDENTIFIER,
    @Estado NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.RifaParticipacion
    SET Estado = @Estado
    WHERE Id = @Id;
END