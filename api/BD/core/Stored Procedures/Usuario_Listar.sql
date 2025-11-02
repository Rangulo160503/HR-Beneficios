
/* =========================================================
   core.Usuario_Listar
   Lista usuarios; permite filtrar por ProveedorId o Correo.
   ========================================================= */
CREATE   PROCEDURE core.Usuario_Listar
    @ProveedorId UNIQUEIDENTIFIER = NULL,
    @Correo      NVARCHAR(120)    = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT  U.UsuarioId,
            U.Correo,
            U.Nombre,
            U.Telefono,
            U.FechaRegistro,
            U.ProveedorId
    FROM core.Usuario U
    WHERE (@ProveedorId IS NULL OR U.ProveedorId = @ProveedorId)
      AND (@Correo      IS NULL OR U.Correo = @Correo)
    ORDER BY U.FechaRegistro DESC;
END