/* =========================================================
   core.AdminUsuario_Crear
   Crea un administrador usando el hash de password provisto.
   ========================================================= */
CREATE PROCEDURE [core].[AdminUsuario_Crear]
    @Usuario      NVARCHAR(50),
    @Nombre       NVARCHAR(100) = NULL,
    @Correo       NVARCHAR(150) = NULL,
    @PasswordHash NVARCHAR(200),
    @Activo       BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NuevoId UNIQUEIDENTIFIER = NEWSEQUENTIALID();

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
GO
