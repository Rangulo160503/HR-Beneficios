CREATE   PROCEDURE core.BeneficioImagen_Eliminar
    @ImagenId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM core.BeneficioImagen
    WHERE ImagenId = @ImagenId;

    SELECT @ImagenId AS EliminadoId;
END