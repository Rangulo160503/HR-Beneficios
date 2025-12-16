/* =========================================================
   core.AdminUsuario_ActualizarUltimoLogin
   Actualiza la fecha de último login para el administrador.
   ========================================================= */
CREATE OR ALTER PROCEDURE [core].[AdminUsuario_ActualizarUltimoLogin]
    @AdminUsuarioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.tbAdminUsuario
    SET UltimoLogin = sysdatetime()
    WHERE AdminUsuarioId = @AdminUsuarioId;

    SELECT @AdminUsuarioId AS AdminUsuarioId;
END
GO
