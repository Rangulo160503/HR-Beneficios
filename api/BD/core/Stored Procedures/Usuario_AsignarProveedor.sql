
/* =========================================================
   core.Usuario_AsignarProveedor
   Asigna/actualiza ProveedorId a un usuario.
   ========================================================= */
CREATE   PROCEDURE core.Usuario_AsignarProveedor
    @UsuarioId   UNIQUEIDENTIFIER,
    @ProveedorId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM core.Usuario   WHERE UsuarioId   = @UsuarioId)
    BEGIN RAISERROR('El usuario no existe.',16,1); RETURN; END;

    IF NOT EXISTS (SELECT 1 FROM core.Proveedor WHERE ProveedorId = @ProveedorId)
    BEGIN RAISERROR('El proveedor no existe.',16,1); RETURN; END;

    UPDATE core.Usuario
       SET ProveedorId = @ProveedorId
     WHERE UsuarioId   = @UsuarioId;

    SELECT @UsuarioId AS UsuarioId, @ProveedorId AS ProveedorId;
END