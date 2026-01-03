
CREATE   PROCEDURE [core].[InfoBoardItem_Listar]
    @Activo   BIT = 1,
    @Busqueda NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Ahora DATETIME2(7) = SYSUTCDATETIME();

    SELECT InfoBoardItemId,
           Titulo,
           Descripcion,
           Url,
           Tipo,
           Prioridad,
           Activo,
           FechaInicio,
           FechaFin,
           CreatedAt,
           UpdatedAt
    FROM core.InfoBoardItem
    WHERE IsDeleted = 0
      AND (@Activo IS NULL OR Activo = @Activo)
      AND (
            @Activo IS NULL
            OR @Activo = 0
            OR (
                (FechaInicio IS NULL OR FechaInicio <= @Ahora)
                AND (FechaFin IS NULL OR FechaFin >= @Ahora)
            )
      )
      AND (
            @Busqueda IS NULL
            OR LTRIM(RTRIM(@Busqueda)) = ''
            OR Titulo LIKE '%' + @Busqueda + '%'
            OR Descripcion LIKE '%' + @Busqueda + '%'
      )
    ORDER BY Prioridad DESC, CreatedAt DESC;
END