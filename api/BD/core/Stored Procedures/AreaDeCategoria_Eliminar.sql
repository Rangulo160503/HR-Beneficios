CREATE   PROCEDURE core.AreaDeCategoria_Eliminar
    @AreaDeCategoriaId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        IF (@AreaDeCategoriaId IS NULL)
            THROW 50003, 'El Id es requerido.', 1;

        IF NOT EXISTS (
            SELECT 1 FROM core.AreaDeCategoria
            WHERE AreaDeCategoriaId = @AreaDeCategoriaId
        )
            THROW 50004, 'No existe el área indicada.', 1;

        BEGIN TRAN;

        DELETE FROM core.AreaDeCategoria
        WHERE AreaDeCategoriaId = @AreaDeCategoriaId;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF (XACT_STATE() <> 0) ROLLBACK TRAN;

        DECLARE @ErrNum INT = ERROR_NUMBER(),
                @Msg    NVARCHAR(4000) = ERROR_MESSAGE();

        -- 547: violación de FK
        IF (@ErrNum = 547)
            RAISERROR('No se puede eliminar: hay categorías que referencian esta área.', 16, 1);
        ELSE
            RAISERROR(@Msg, 16, 1);
    END CATCH
END