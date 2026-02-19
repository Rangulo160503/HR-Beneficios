

/* SQL_STORED_PROCEDURE core.ObtenerBeneficiosPorCategoria */
CREATE   PROCEDURE [core].[ObtenerBeneficiosPorCategoria]
    @CategoriaId UNIQUEIDENTIFIER,
    @Page INT = 1,
    @PageSize INT = 50,
    @Search NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SET @Page = CASE WHEN @Page < 1 THEN 1 ELSE @Page END;
    SET @PageSize = CASE WHEN @PageSize < 1 THEN 50 ELSE @PageSize END;

    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    DECLARE @Pattern NVARCHAR(202) = NULL;
    IF (@Search IS NOT NULL AND LTRIM(RTRIM(@Search)) <> N'')
        SET @Pattern = N'%' + LTRIM(RTRIM(@Search)) + N'%';

    ;WITH base AS (
        SELECT
            b.BeneficioId,
            b.Titulo,
            b.Descripcion,
            b.PrecioCRC,
            b.Condiciones,
            b.VigenciaInicio,
            b.VigenciaFin,
            b.Disponible,
            b.Origen,
            b.CreadoEn,
            b.ModificadoEn,
            b.Imagen,
            b.CategoriaId,
            b.ProveedorId,
            b.Estado,
            b.FechaCreacion,
            b.FechaAprobacion,
            b.AprobadoPorUsuarioId,
            p.Nombre AS ProveedorNombre,
            c.Nombre AS CategoriaNombre
            -- si tu tabla es core.Categoria(Titulo), usa:
            -- c.Titulo AS CategoriaNombre
        FROM core.Beneficio b
        INNER JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId
        INNER JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId
        WHERE b.CategoriaId = @CategoriaId
          AND (
                @Pattern IS NULL
                OR b.Titulo LIKE @Pattern
                OR p.Nombre LIKE @Pattern
          )
    )
    SELECT
        *,
        Total = COUNT(*) OVER()
    FROM base
    ORDER BY FechaCreacion DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END