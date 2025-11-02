
/* =========================================================
   core.Usuario_Obtener
   Obtiene un usuario por UsuarioId.
   ========================================================= */
CREATE   PROCEDURE core.Usuario_Obtener
    @UsuarioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT  U.UsuarioId,
            U.Correo,
            U.Nombre,
            U.Telefono,
            U.FechaRegistro,
            U.ProveedorId,
            U.PasswordHash
    FROM core.Usuario U
    WHERE U.UsuarioId = @UsuarioId;
END