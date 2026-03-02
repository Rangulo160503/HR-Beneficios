
CREATE   PROCEDURE [core].[InfoBoardItem_Editar]
    @InfoBoardItemId UNIQUEIDENTIFIER,
    @Titulo          NVARCHAR(120),
    @Descripcion     NVARCHAR(500) = NULL,
    @Url             NVARCHAR(500),
    @Tipo            NVARCHAR(50) = NULL,
    @Prioridad       INT = 0,
    @Activo          BIT = 1,
    @FechaInicio     DATETIME2(7) = NULL,
    @FechaFin        DATETIME2(7) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.InfoBoardItem
    SET Titulo = @Titulo,
        Descripcion = @Descripcion,
        Url = @Url,
        Tipo = @Tipo,
        Prioridad = ISNULL(@Prioridad, 0),
        Activo = ISNULL(@Activo, 1),
        FechaInicio = @FechaInicio,
        FechaFin = @FechaFin,
        UpdatedAt = SYSUTCDATETIME()
    WHERE InfoBoardItemId = @InfoBoardItemId
      AND IsDeleted = 0;

    SELECT @InfoBoardItemId AS InfoBoardItemId;
END