
/* =========================================================
   core.Usuario_QuitarProveedor
   Pone ProveedorId = NULL para el usuario.
   ========================================================= */
CREATE   PROCEDURE core.Usuario_QuitarProveedor
    @UsuarioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM core.Usuario WHERE UsuarioId = @UsuarioId)
    BEGIN RAISERROR('El usuario no existe.',16,1); RETURN; END;

    UPDATE core.Usuario
       SET ProveedorId = NULL
     WHERE UsuarioId   = @UsuarioId;

    SELECT @UsuarioId AS UsuarioId;
END