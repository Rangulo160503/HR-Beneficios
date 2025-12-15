CREATE PROCEDURE core.RifaParticipacion_ActualizarEstado
    @Id INT,
    @Estado NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.RifaParticipacion
    SET Estado = @Estado
    WHERE Id = @Id;
END
