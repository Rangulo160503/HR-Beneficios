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
GO
