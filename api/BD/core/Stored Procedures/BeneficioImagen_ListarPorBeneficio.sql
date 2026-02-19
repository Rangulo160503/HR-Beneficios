

/* SQL_STORED_PROCEDURE core.BeneficioImagen_ListarPorBeneficio */
CREATE   PROCEDURE core.BeneficioImagen_ListarPorBeneficio
    @BeneficioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ImagenId,
        BeneficioId,
        Imagen,
        Orden,
        CreadoEn,
        ModificadoEn
    FROM core.BeneficioImagen
    WHERE BeneficioId = @BeneficioId
    ORDER BY Orden ASC, CreadoEn ASC;
END