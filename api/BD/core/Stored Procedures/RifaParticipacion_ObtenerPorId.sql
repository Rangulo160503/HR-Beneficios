CREATE PROCEDURE core.RifaParticipacion_ObtenerPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Nombre, Correo, Telefono, Mensaje, Source, Estado, FechaCreacion
    FROM core.RifaParticipacion
    WHERE Id = @Id;
END
