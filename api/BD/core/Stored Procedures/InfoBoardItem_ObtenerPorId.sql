
CREATE   PROCEDURE [core].[InfoBoardItem_ObtenerPorId]
    @InfoBoardItemId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

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
    WHERE InfoBoardItemId = @InfoBoardItemId
      AND IsDeleted = 0;
END