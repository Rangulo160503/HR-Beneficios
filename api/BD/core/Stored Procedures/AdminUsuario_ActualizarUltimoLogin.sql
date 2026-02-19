/* SQL_STORED_PROCEDURE core.AdminUsuario_ActualizarUltimoLogin */
/* =========================================================
   4) SP: core.AdminUsuario_ActualizarUltimoLogin
   ========================================================= */
CREATE   PROCEDURE [core].[AdminUsuario_ActualizarUltimoLogin]
    @AdminUsuarioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.tbAdminUsuario
    SET UltimoLogin = SYSUTCDATETIME()
    WHERE AdminUsuarioId = @AdminUsuarioId;

    SELECT @AdminUsuarioId AS AdminUsuarioId;
END