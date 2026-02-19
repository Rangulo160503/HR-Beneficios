

/* SQL_STORED_PROCEDURE core.Usuario_Obtener */


/* =========================================================
   core.Usuario_Obtener
   Obtiene un usuario por UsuarioId.
   - Mantiene una columna de compatibilidad 'ProveedorId' (TOP 1)
     para no romper clientes antiguos que esperaban ese campo.
   ========================================================= */
CREATE   PROCEDURE [core].[Usuario_Obtener]
    @UsuarioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        U.UsuarioId,
        U.Correo,
        U.Nombre,
        U.Telefono,
        U.FechaRegistro,
        U.PasswordHash,
        U.Tipo,
        U.Estado,
        -- Compatibilidad: un solo ProveedorId “representativo” (si hay varios, toma el más reciente)
        ProveedorId = (
            SELECT TOP (1) PU.ProveedorId
            FROM core.ProveedorUsuario PU
            WHERE PU.UsuarioId = U.UsuarioId
            ORDER BY PU.FechaAsignacion DESC
        )
    FROM core.Usuario U
    WHERE U.UsuarioId = @UsuarioId;

    -- Si luego querés, puedes añadir un 2.º resultset con TODOS los proveedores del usuario:
    -- SELECT PU.ProveedorId, PU.Rol, PU.FechaAsignacion
    -- FROM core.ProveedorUsuario PU WHERE PU.UsuarioId = @UsuarioId
    -- ORDER BY PU.FechaAsignacion DESC;
END