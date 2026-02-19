CREATE TABLE [core].[tbAdminUsuario] (
    [AdminUsuarioId] UNIQUEIDENTIFIER NOT NULL,
    [Usuario]        NVARCHAR (100)   NOT NULL,
    [Nombre]         NVARCHAR (200)   NOT NULL,
    [Correo]         NVARCHAR (300)   NOT NULL,
    [PasswordHash]   NVARCHAR (400)   NULL,
    [Activo]         BIT              NOT NULL,
    [FechaCreacion]  DATETIME2 (3)    NOT NULL,
    [UltimoLogin]    DATETIME2 (3)    NULL,
    CONSTRAINT [PK_tbAdminUsuario] PRIMARY KEY CLUSTERED ([AdminUsuarioId] ASC)
);




GO
