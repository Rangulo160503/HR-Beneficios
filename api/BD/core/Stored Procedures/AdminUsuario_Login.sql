

/* SQL_STORED_PROCEDURE core.AdminUsuario_Login */
CREATE   PROCEDURE [core].[AdminUsuario_Login]
    @Usuario NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        AdminUsuarioId,
        Usuario,
        Nombre,
        Correo,
        PasswordHash,
        Activo,
        FechaCreacion,
        UltimoLogin
    FROM core.tbAdminUsuario
    WHERE Usuario = @Usuario;
END