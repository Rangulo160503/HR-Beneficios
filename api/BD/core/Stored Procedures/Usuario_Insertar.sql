

/* SQL_STORED_PROCEDURE core.Usuario_Insertar */

/* =========================================================
   core.Usuario_Insertar
   Crea usuario y devuelve UsuarioId (GUID).
   Modelo actual:
     - core.Usuario(UsuarioId, Correo, Nombre, Telefono,
                    FechaRegistro (DEFAULT), PasswordHash,
                    Tipo, Estado)
   ========================================================= */
CREATE   PROCEDURE [core].[Usuario_Insertar]
    @Correo        NVARCHAR(254),
    @Nombre        NVARCHAR(120) = NULL,
    @Telefono      NVARCHAR(32)  = NULL,
    @PasswordHash  NVARCHAR(512) = NULL,
    @Tipo          NVARCHAR(20)  = N'Cliente',  -- 'Cliente' | 'Proveedor' | 'Admin'
    @Estado        TINYINT       = 0            -- 0: Pendiente, 1: Activo, 2: Inactivo, 3: Bloqueado
AS
BEGIN
    SET NOCOUNT ON;

    -- Normalizar entradas mínimas
    SET @Correo = LOWER(LTRIM(RTRIM(@Correo)));
    IF (@Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = N'')
        SET @Nombre = @Correo;  -- Fallback sencillo; ajusta la regla si prefieres forzar NOT NULL

    -- Verificación de unicidad con hint para evitar carrera (similar a SERIALIZABLE a nivel fila)
    IF EXISTS (
        SELECT 1
        FROM core.Usuario WITH (UPDLOCK, HOLDLOCK)
        WHERE Correo = @Correo
    )
    BEGIN
        RAISERROR('El correo ya existe para otro usuario.', 16, 1);
        RETURN;
    END

    DECLARE @NuevoId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO core.Usuario
        (UsuarioId, Correo, Nombre, Telefono, PasswordHash, Tipo, Estado)
    VALUES
        (@NuevoId, @Correo, @Nombre, @Telefono, @PasswordHash, @Tipo, @Estado);

    SELECT @NuevoId AS UsuarioId;
END