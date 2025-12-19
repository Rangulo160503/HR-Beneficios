CREATE PROCEDURE core.ReasignarBeneficiosCategoria
    @FromCategoriaId UNIQUEIDENTIFIER,
    @ToCategoriaId UNIQUEIDENTIFIER,
    @BeneficioIds NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @FromCategoriaId = @ToCategoriaId
        THROW 50021, 'La categoría destino debe ser diferente.', 1;

    DECLARE @Actualizados INT = 0;

    IF (@BeneficioIds IS NOT NULL AND LTRIM(RTRIM(@BeneficioIds)) <> '')
    BEGIN
        DECLARE @Ids TABLE (Id UNIQUEIDENTIFIER PRIMARY KEY);
        INSERT INTO @Ids (Id)
        SELECT TRY_CAST(value AS UNIQUEIDENTIFIER)
        FROM STRING_SPLIT(@BeneficioIds, ',')
        WHERE TRY_CAST(value AS UNIQUEIDENTIFIER) IS NOT NULL;

        UPDATE b
            SET b.CategoriaId = @ToCategoriaId
        FROM core.Beneficio b
        INNER JOIN @Ids ids ON ids.Id = b.BeneficioId
        WHERE b.CategoriaId = @FromCategoriaId;

        SET @Actualizados = @@ROWCOUNT;
    END
    ELSE
    BEGIN
        UPDATE core.Beneficio
        SET CategoriaId = @ToCategoriaId
        WHERE CategoriaId = @FromCategoriaId;

        SET @Actualizados = @@ROWCOUNT;
    END

    SELECT @Actualizados AS Actualizados;
END
