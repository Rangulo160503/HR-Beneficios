CREATE PROCEDURE [core].[InfoBoardItem_Eliminar]
    @InfoBoardItemId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.InfoBoardItem
    SET IsDeleted = 1,
        Activo = 0,
        UpdatedAt = SYSUTCDATETIME()
    WHERE InfoBoardItemId = @InfoBoardItemId;

    SELECT @InfoBoardItemId AS InfoBoardItemId;
END
GO
