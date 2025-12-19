
-- 5) SP: Actualizar UltimoLogin
CREATE   PROCEDURE [core].[AdminUsuario_ActualizarUltimoLogin]
    @AdminUsuarioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.tbAdminUsuario
    SET UltimoLogin = sysdatetime()
    WHERE AdminUsuarioId = @AdminUsuarioId;

    SELECT @AdminUsuarioId AS AdminUsuarioId;
END