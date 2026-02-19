

/* SQL_STORED_PROCEDURE core.AreaDeCategoria_Listar */


/* =========================================================
   SP: LISTAR
   Búsqueda (por nombre) + paginación
   ========================================================= */
CREATE   PROCEDURE core.AreaDeCategoria_Listar
    @Buscar NVARCHAR(150) = NULL,        -- término opcional
    @Page INT = 1,                        -- 1-based
    @PageSize INT = 20                    -- tamaño de página
AS
BEGIN
    SET NOCOUNT ON;

    IF (@Page < 1) SET @Page = 1;
    IF (@PageSize < 1) SET @PageSize = 20;

    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH Q AS (
        SELECT
            A.AreaDeCategoriaId,
            A.Nombre
        FROM core.AreaDeCategoria A
        WHERE (@Buscar IS NULL OR @Buscar = N'')
              OR (A.Nombre LIKE N'%' + @Buscar + N'%')
    )
    SELECT
        AreaDeCategoriaId,
        Nombre
    FROM Q
    ORDER BY Nombre
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

    -- Total de filas para paginación (opcional)
    SELECT COUNT(1) AS TotalFilas
    FROM core.AreaDeCategoria A
    WHERE (@Buscar IS NULL OR @Buscar = N'')
          OR (A.Nombre LIKE N'%' + @Buscar + N'%');
END