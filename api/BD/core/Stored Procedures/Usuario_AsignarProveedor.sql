

/* SQL_STORED_PROCEDURE core.Usuario_AsignarProveedor */


/* =========================================================
   core.Usuario_AsignarProveedor
   Crea (idempotente) la relación Usuario–Proveedor en core.ProveedorUsuario.
   ========================================================= */
CREATE   PROCEDURE [core].[Usuario_AsignarProveedor]
    @UsuarioId   UNIQUEIDENTIFIER,
    @ProveedorId UNIQUEIDENTIFIER,
    @Rol         NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM core.Usuario   WHERE UsuarioId   = @UsuarioId)
    BEGIN RAISERROR('El usuario no existe.',16,1); RETURN; END;

    IF NOT EXISTS (SELECT 1 FROM core.Proveedor WHERE ProveedorId = @ProveedorId)
    BEGIN RAISERROR('El proveedor no existe.',16,1); RETURN; END;

    -- Idempotente: no duplica si ya existe
    IF NOT EXISTS (
        SELECT 1 FROM core.ProveedorUsuario
        WHERE UsuarioId = @UsuarioId AND ProveedorId = @ProveedorId
    )
    BEGIN
        INSERT INTO core.ProveedorUsuario (ProveedorId, UsuarioId, Rol)
        VALUES (@ProveedorId, @UsuarioId, @Rol);
    END

    SELECT @UsuarioId AS UsuarioId, @ProveedorId AS ProveedorId, @Rol AS Rol;
END