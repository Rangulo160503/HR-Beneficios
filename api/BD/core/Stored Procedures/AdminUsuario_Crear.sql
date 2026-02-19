

/* SQL_STORED_PROCEDURE core.AdminUsuario_Crear */
/* =========================================================
   3) SP: core.AdminUsuario_Crear
   Crea admin (si querés idempotencia, se puede ajustar)
   ========================================================= */
CREATE   PROCEDURE [core].[AdminUsuario_Crear]
    @Usuario      NVARCHAR(50),
    @Nombre       NVARCHAR(100) = NULL,
    @Correo       NVARCHAR(150) = NULL,
    @PasswordHash NVARCHAR(200),
    @Activo       BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    -- Evitar duplicados por Usuario
    IF EXISTS (SELECT 1 FROM core.tbAdminUsuario WHERE Usuario = @Usuario)
    BEGIN
        RAISERROR('Ya existe un AdminUsuario con ese Usuario.', 16, 1);
        RETURN;
    END

    DECLARE @NuevoId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO core.tbAdminUsuario
    (
        AdminUsuarioId,
        Usuario,
        Nombre,
        Correo,
        PasswordHash,
        Activo
    )
    VALUES
    (
        @NuevoId,
        @Usuario,
        @Nombre,
        @Correo,
        @PasswordHash,
        @Activo
    );

    SELECT @NuevoId AS AdminUsuarioId;
END