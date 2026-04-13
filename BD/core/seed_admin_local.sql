

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'core')
BEGIN
    EXEC('CREATE SCHEMA core');
END
GO

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

IF NOT EXISTS (SELECT 1 FROM core.tbAdminUsuario WHERE Usuario = 'admin')
BEGIN
    INSERT INTO core.tbAdminUsuario (AdminUsuarioId, Usuario, Nombre, Correo, PasswordHash, Activo)
    VALUES (NEWID(), 'admin', 'Administrador', 'admin@hrbeneficios.local', '__BCRYPT_HASH_AQUI__', 1);
END
GO
