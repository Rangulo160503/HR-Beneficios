

/* SQL_STORED_PROCEDURE core.BeneficioImagen_Obtener */
CREATE   PROCEDURE core.BeneficioImagen_Obtener
    @ImagenId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ImagenId,
        BeneficioId,
        Imagen,            -- VARBINARY(MAX)
        Orden,
        CreadoEn,
        ModificadoEn
    FROM core.BeneficioImagen
    WHERE ImagenId = @ImagenId;
END