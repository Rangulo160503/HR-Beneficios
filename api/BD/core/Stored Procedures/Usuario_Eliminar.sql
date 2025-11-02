
/* =========================================================
   core.Usuario_Eliminar
   Elimina por UsuarioId.
   ========================================================= */
CREATE   PROCEDURE core.Usuario_Eliminar
    @UsuarioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM core.Usuario WHERE UsuarioId = @UsuarioId)
    BEGIN RAISERROR('El usuario no existe.',16,1); RETURN; END;

    DELETE FROM core.Usuario WHERE UsuarioId = @UsuarioId;

    SELECT @UsuarioId AS UsuarioId;
END