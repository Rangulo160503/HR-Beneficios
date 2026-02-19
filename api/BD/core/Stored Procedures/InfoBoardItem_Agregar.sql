

/* SQL_STORED_PROCEDURE core.InfoBoardItem_Agregar */

/* 4) Stored Procedures */
CREATE   PROCEDURE [core].[InfoBoardItem_Agregar]
    @Titulo       NVARCHAR(120),
    @Descripcion  NVARCHAR(500) = NULL,
    @Url          NVARCHAR(500),
    @Tipo         NVARCHAR(50) = NULL,
    @Prioridad    INT = 0,
    @Activo       BIT = 1,
    @FechaInicio  DATETIME2(7) = NULL,
    @FechaFin     DATETIME2(7) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Id UNIQUEIDENTIFIER = NEWID();

    INSERT INTO core.InfoBoardItem
        (InfoBoardItemId, Titulo, Descripcion, Url, Tipo, Prioridad, Activo, FechaInicio, FechaFin, CreatedAt, UpdatedAt, IsDeleted)
    VALUES
        (@Id, @Titulo, @Descripcion, @Url, @Tipo, ISNULL(@Prioridad, 0), ISNULL(@Activo, 1), @FechaInicio, @FechaFin, SYSUTCDATETIME(), SYSUTCDATETIME(), 0);

    SELECT @Id AS InfoBoardItemId;
END