

/* =========================================================
   core.Usuario_QuitarProveedor
   Quita relación Usuario–Proveedor.
   - Si @ProveedorId es NULL: elimina TODAS las relaciones del usuario.
   - Si viene @ProveedorId: elimina solo esa relación.
   ========================================================= */
CREATE PROCEDURE [core].[Usuario_QuitarProveedor]
    @UsuarioId   UNIQUEIDENTIFIER,
    @ProveedorId UNIQUEIDENTIFIER = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM core.Usuario WHERE UsuarioId = @UsuarioId)
    BEGIN RAISERROR('El usuario no existe.',16,1); RETURN; END;

    IF @ProveedorId IS NULL
    BEGIN
        -- Comportamiento compatible con “poner ProveedorId = NULL”: quita todas las asignaciones
        DELETE FROM core.ProveedorUsuario
        WHERE UsuarioId = @UsuarioId;
    END
    ELSE
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM core.Proveedor WHERE ProveedorId = @ProveedorId)
        BEGIN RAISERROR('El proveedor no existe.',16,1); RETURN; END;

        DELETE FROM core.ProveedorUsuario
        WHERE UsuarioId = @UsuarioId
          AND ProveedorId = @ProveedorId;
    END

    SELECT @UsuarioId AS UsuarioId, @ProveedorId AS ProveedorId;
END