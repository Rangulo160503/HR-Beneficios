
CREATE PROCEDURE core.ReasignarBeneficiosCategoria
    @FromCategoriaId UNIQUEIDENTIFIER,
    @ToCategoriaId   UNIQUEIDENTIFIER,
    @BeneficioIds    NVARCHAR(MAX) = NULL -- CSV opcional
AS
BEGIN
    SET NOCOUNT ON;

    -- Validaciones básicas
    IF @FromCategoriaId = @ToCategoriaId
        THROW 50021, 'La categoría destino debe ser diferente.', 1;

    IF NOT EXISTS (
        SELECT 1 FROM core.Categoria WHERE CategoriaId = @FromCategoriaId
    )
        THROW 50022, 'La categoría origen no existe.', 1;

    IF NOT EXISTS (
        SELECT 1 FROM core.Categoria WHERE CategoriaId = @ToCategoriaId
    )
        THROW 50023, 'La categoría destino no existe.', 1;

    DECLARE @Actualizados INT = 0;

    -- Caso 1: Reasignar SOLO beneficios específicos
    IF (@BeneficioIds IS NOT NULL AND LTRIM(RTRIM(@BeneficioIds)) <> '')
    BEGIN
        DECLARE @Ids TABLE (Id UNIQUEIDENTIFIER PRIMARY KEY);

        INSERT INTO @Ids (Id)
        SELECT DISTINCT TRY_CAST(value AS UNIQUEIDENTIFIER)
        FROM STRING_SPLIT(@BeneficioIds, ',')
        WHERE TRY_CAST(value AS UNIQUEIDENTIFIER) IS NOT NULL;

        UPDATE b
           SET b.CategoriaId = @ToCategoriaId
        FROM core.Beneficio b
        INNER JOIN @Ids i ON i.Id = b.BeneficioId
        WHERE b.CategoriaId = @FromCategoriaId;

        SET @Actualizados = @@ROWCOUNT;
    END
    ELSE
    BEGIN
        -- Caso 2: Reasignar TODOS los beneficios
        UPDATE core.Beneficio
           SET CategoriaId = @ToCategoriaId
        WHERE CategoriaId = @FromCategoriaId;

        SET @Actualizados = @@ROWCOUNT;
    END

    SELECT @Actualizados AS Actualizados;
END;