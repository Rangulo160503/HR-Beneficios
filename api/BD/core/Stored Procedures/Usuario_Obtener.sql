


CREATE PROCEDURE [core].[Usuario_Obtener]
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
        ProveedorId = (
            SELECT TOP (1) PU.ProveedorId
            FROM core.ProveedorUsuario PU
            WHERE PU.UsuarioId = U.UsuarioId
            ORDER BY PU.FechaAsignacion DESC
        )
    FROM core.Usuario U
    WHERE U.UsuarioId = @UsuarioId;

END
