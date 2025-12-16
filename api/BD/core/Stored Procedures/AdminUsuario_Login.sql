/* =========================================================
   core.AdminUsuario_Login
   Busca un administrador por Usuario y devuelve su hash para
   validar en la capa de aplicación.
   ========================================================= */
CREATE OR ALTER PROCEDURE [core].[AdminUsuario_Login]
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
GO
