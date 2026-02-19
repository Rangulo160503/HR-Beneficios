

/* SQL_STORED_PROCEDURE core.AreaDeCategoria_Editar */
CREATE   PROCEDURE core.AreaDeCategoria_Editar
    @AreaDeCategoriaId UNIQUEIDENTIFIER,
    @Nombre NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        IF (@AreaDeCategoriaId IS NULL)
            THROW 50003, 'El Id es requerido.', 1;

        IF (@Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = N'')
            THROW 50001, 'El nombre es requerido.', 1;

        -- Validar existencia
        IF NOT EXISTS (SELECT 1 FROM core.AreaDeCategoria WHERE AreaDeCategoriaId = @AreaDeCategoriaId)
            THROW 50004, 'No existe el área indicada.', 1;

        -- Validar duplicado contra otros registros
        IF EXISTS (
            SELECT 1
            FROM core.AreaDeCategoria
            WHERE Nombre = @Nombre COLLATE Latin1_General_CI_AI
              AND AreaDeCategoriaId <> @AreaDeCategoriaId
        )
            THROW 50002, 'Ya existe un área con ese nombre.', 1;

        BEGIN TRAN;

        UPDATE core.AreaDeCategoria
        SET Nombre = @Nombre
        WHERE AreaDeCategoriaId = @AreaDeCategoriaId;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF (XACT_STATE() <> 0) ROLLBACK TRAN;
        DECLARE @Msg NVARCHAR(2048) = ERROR_MESSAGE();
        RAISERROR(@Msg, 16, 1);
    END CATCH
END