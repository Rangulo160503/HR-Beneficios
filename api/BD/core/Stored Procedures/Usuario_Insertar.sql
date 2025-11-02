
/* =========================================================
   core.Usuario_Insertar
   Crea usuario y devuelve UsuarioId (GUID).
   ========================================================= */
CREATE   PROCEDURE core.Usuario_Insertar
    @Correo        NVARCHAR(120),
    @Nombre        NVARCHAR(120) = NULL,
    @Telefono      VARCHAR(8)    = NULL,
    @PasswordHash  NVARCHAR(255) = NULL,
    @ProveedorId   UNIQUEIDENTIFIER = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM core.Usuario WHERE Correo = @Correo)
    BEGIN RAISERROR('El correo ya existe para otro usuario.',16,1); RETURN; END;

    DECLARE @NuevoId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO core.Usuario (UsuarioId, Correo, Nombre, Telefono, PasswordHash, ProveedorId)
    VALUES (@NuevoId, @Correo, @Nombre, @Telefono, @PasswordHash, @ProveedorId);

    SELECT @NuevoId AS UsuarioId;
END