
/* =========================================================
   core.Usuario_Listar
   Lista usuarios; permite filtrar por ProveedorId o Correo.
   - @ProveedorId: si viene, filtra via tabla puente core.ProveedorUsuario
   - @Correo: comparación exacta tras normalizar (lower/trim)
   ========================================================= */
CREATE PROCEDURE [core].[Usuario_Listar]
    @ProveedorId UNIQUEIDENTIFIER = NULL,
    @Correo      NVARCHAR(254)    = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Normalización mínima
    SET @Correo = CASE WHEN @Correo IS NULL THEN NULL ELSE LOWER(LTRIM(RTRIM(@Correo))) END;

    SELECT
        U.UsuarioId,
        U.Correo,
        U.Nombre,
        U.Telefono,
        U.FechaRegistro,
        U.Tipo,
        U.Estado
    FROM core.Usuario U
    WHERE (@Correo IS NULL OR U.Correo = @Correo)
      AND (
            @ProveedorId IS NULL
            OR EXISTS (
                SELECT 1
                FROM core.ProveedorUsuario PU
                WHERE PU.UsuarioId   = U.UsuarioId
                  AND PU.ProveedorId = @ProveedorId
            )
          )
    ORDER BY U.FechaRegistro DESC;
END