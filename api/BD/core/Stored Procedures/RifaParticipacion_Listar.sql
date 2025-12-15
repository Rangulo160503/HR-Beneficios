CREATE PROCEDURE core.RifaParticipacion_Listar
    @Q NVARCHAR(200) = NULL,
    @From DATETIME2 = NULL,
    @To DATETIME2 = NULL,
    @Page INT = 1,
    @PageSize INT = 20,
    @SortCampo NVARCHAR(30) = 'FechaCreacion',
    @SortDir NVARCHAR(4) = 'DESC'
AS
BEGIN
    SET NOCOUNT ON;

    SET @Page = CASE WHEN @Page < 1 THEN 1 ELSE @Page END;
    SET @PageSize = CASE WHEN @PageSize < 1 THEN 20 WHEN @PageSize > 100 THEN 100 ELSE @PageSize END;

    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    SET @SortCampo = CASE WHEN @SortCampo IN ('Nombre','Correo','FechaCreacion','Estado') THEN @SortCampo ELSE 'FechaCreacion' END;
    SET @SortDir = CASE WHEN UPPER(@SortDir) = 'ASC' THEN 'ASC' ELSE 'DESC' END;

    DECLARE @Sql NVARCHAR(MAX) = '
        SELECT Id, Nombre, Correo, Telefono, Mensaje, Source, Estado, FechaCreacion,
               COUNT(*) OVER() AS TotalFiltrado
        FROM core.RifaParticipacion
        WHERE 1=1';

    IF @Q IS NOT NULL
        SET @Sql += ' AND (Nombre LIKE @QPattern OR Correo LIKE @QPattern OR Telefono LIKE @QPattern)';
    IF @From IS NOT NULL
        SET @Sql += ' AND FechaCreacion >= @From';
    IF @To IS NOT NULL
        SET @Sql += ' AND FechaCreacion <= @To';

    SET @Sql += ' ORDER BY ' + QUOTENAME(@SortCampo) + ' ' + @SortDir +
                ' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;';

    DECLARE @QPattern NVARCHAR(260) = NULL;
    IF @Q IS NOT NULL SET @QPattern = '%' + @Q + '%';

    EXEC sp_executesql @Sql,
       N'@QPattern NVARCHAR(260), @From DATETIME2, @To DATETIME2, @Offset INT, @PageSize INT',
       @QPattern=@QPattern, @From=@From, @To=@To, @Offset=@Offset, @PageSize=@PageSize;
END
