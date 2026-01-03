/*
    Seed local para bootstrap del usuario administrador.
    - Crea schema y tabla core.tbAdminUsuario si no existen.
    - Actualiza/crea los procedimientos necesarios para autenticación.
    - Inserta el usuario admin inicial de forma idempotente usando un hash bcrypt provisto.
*/

-- Crear schema core si no existe
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'core')
BEGIN
    EXEC('CREATE SCHEMA core');
END
GO

-- Crear tabla core.tbAdminUsuario si no existe
IF NOT EXISTS (
    SELECT 1
    FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = 'core' AND t.name = 'tbAdminUsuario'
)
BEGIN
    CREATE TABLE [core].[tbAdminUsuario]
    (
        [AdminUsuarioId] UNIQUEIDENTIFIER NOT NULL DEFAULT (newsequentialid()),
        [Usuario]        NVARCHAR(50)    NOT NULL,
        [Nombre]         NVARCHAR(100)   NULL,
        [Correo]         NVARCHAR(150)   NULL,
        [PasswordHash]   NVARCHAR(200)   NOT NULL,
        [Activo]         BIT             NOT NULL DEFAULT ((1)),
        [FechaCreacion]  DATETIME2 (3)   NOT NULL DEFAULT (sysdatetime()),
        [UltimoLogin]    DATETIME2 (3)   NULL,
        CONSTRAINT [PK_tbAdminUsuario] PRIMARY KEY CLUSTERED ([AdminUsuarioId] ASC),
        CONSTRAINT [UQ_tbAdminUsuario_Usuario] UNIQUE NONCLUSTERED ([Usuario] ASC)
    );
END
GO

/* =========================================================
   core.AdminUsuario_Login
   Busca un administrador por Usuario y devuelve su hash para
   validar en la capa de aplicación.
   ========================================================= */
CREATE OR ALTER PROCEDURE [core].[AdminUsuario_Login]
    @Usuario NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        AdminUsuarioId,
        Usuario,
        Nombre,
        Correo,
        PasswordHash,
        Activo,
        FechaCreacion,
        UltimoLogin
    FROM core.tbAdminUsuario
    WHERE Usuario = @Usuario;
END
GO

/* =========================================================
   core.AdminUsuario_Crear
   Crea un administrador usando el hash de password provisto.
   ========================================================= */
CREATE OR ALTER PROCEDURE [core].[AdminUsuario_Crear]
    @Usuario      NVARCHAR(50),
    @Nombre       NVARCHAR(100) = NULL,
    @Correo       NVARCHAR(150) = NULL,
    @PasswordHash NVARCHAR(200),
    @Activo       BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NuevoId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO core.tbAdminUsuario
    (
        AdminUsuarioId,
        Usuario,
        Nombre,
        Correo,
        PasswordHash,
        Activo
    )
    VALUES
    (
        @NuevoId,
        @Usuario,
        @Nombre,
        @Correo,
        @PasswordHash,
        @Activo
    );

    SELECT @NuevoId AS AdminUsuarioId;
END
GO

/* =========================================================
   core.AdminUsuario_ActualizarUltimoLogin
   Actualiza la fecha de último login para el administrador.
   ========================================================= */
CREATE OR ALTER PROCEDURE [core].[AdminUsuario_ActualizarUltimoLogin]
    @AdminUsuarioId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.tbAdminUsuario
    SET UltimoLogin = sysdatetime()
    WHERE AdminUsuarioId = @AdminUsuarioId;

    SELECT @AdminUsuarioId AS AdminUsuarioId;
END
GO

-- Insertar administrador inicial de forma idempotente
IF NOT EXISTS (SELECT 1 FROM core.tbAdminUsuario WHERE Usuario = 'admin')
BEGIN
    INSERT INTO core.tbAdminUsuario (AdminUsuarioId, Usuario, Nombre, Correo, PasswordHash, Activo)
    VALUES (NEWID(), 'admin', 'Administrador', 'admin@hrbeneficios.local', '__BCRYPT_HASH_AQUI__', 1);
END
GO
