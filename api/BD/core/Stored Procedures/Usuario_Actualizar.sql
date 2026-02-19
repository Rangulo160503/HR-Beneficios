

/* SQL_STORED_PROCEDURE core.Usuario_Actualizar */

/* =========================================================
   core.Usuario_Actualizar
   Actualiza datos por UsuarioId (GUID).
   ========================================================= */
CREATE   PROCEDURE core.Usuario_Actualizar
    @UsuarioId     UNIQUEIDENTIFIER,
    @Correo        NVARCHAR(120),
    @Nombre        NVARCHAR(120) = NULL,
    @Telefono      VARCHAR(8)    = NULL,
    @PasswordHash  NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM core.Usuario WHERE UsuarioId = @UsuarioId)
    BEGIN RAISERROR('El usuario no existe.',16,1); RETURN; END;

    IF EXISTS (SELECT 1 FROM core.Usuario WHERE Correo = @Correo AND UsuarioId <> @UsuarioId)
    BEGIN RAISERROR('El correo ya existe para otro usuario.',16,1); RETURN; END;

    UPDATE core.Usuario
       SET Correo       = @Correo,
           Nombre       = @Nombre,
           Telefono     = @Telefono,
           PasswordHash = COALESCE(@PasswordHash, PasswordHash)
     WHERE UsuarioId    = @UsuarioId;

    SELECT @UsuarioId AS UsuarioId;
END