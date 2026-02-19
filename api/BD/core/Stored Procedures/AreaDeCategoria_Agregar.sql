

/* SQL_STORED_PROCEDURE core.AreaDeCategoria_Agregar */
CREATE   PROCEDURE core.AreaDeCategoria_Agregar
    @Nombre NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        IF (@Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = N'')
            THROW 50001, 'El nombre es requerido.', 1;

        IF EXISTS (
            SELECT 1
            FROM core.AreaDeCategoria
            WHERE Nombre = @Nombre COLLATE Latin1_General_CI_AI
        )
            THROW 50002, 'Ya existe un área con ese nombre.', 1;

        DECLARE @NuevoId UNIQUEIDENTIFIER = NEWID();

        INSERT INTO core.AreaDeCategoria (AreaDeCategoriaId, Nombre)
        VALUES (@NuevoId, @Nombre);

        -- 👇 Esto es lo que lee ExecuteScalarAsync<Guid>
        SELECT @NuevoId AS Id;
    END TRY
    BEGIN CATCH
        DECLARE @Msg NVARCHAR(2048) = ERROR_MESSAGE();
        RAISERROR(@Msg, 16, 1);
    END CATCH
END