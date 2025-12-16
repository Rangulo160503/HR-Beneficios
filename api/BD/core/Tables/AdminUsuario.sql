CREATE TABLE [core].[tbAdminUsuario] (
    [AdminUsuarioId] UNIQUEIDENTIFIER CONSTRAINT [DF_tbAdminUsuario_AdminUsuarioId] DEFAULT (newsequentialid()) NOT NULL,
    [Usuario]        NVARCHAR (50)    NOT NULL,
    [Nombre]         NVARCHAR (100)   NULL,
    [Correo]         NVARCHAR (150)   NULL,
    [PasswordHash]   NVARCHAR (200)   NOT NULL,
    [Activo]         BIT              CONSTRAINT [DF_tbAdminUsuario_Activo] DEFAULT ((1)) NOT NULL,
    [FechaCreacion]  DATETIME2 (3)    CONSTRAINT [DF_tbAdminUsuario_FechaCreacion] DEFAULT (sysdatetime()) NOT NULL,
    [UltimoLogin]    DATETIME2 (3)    NULL,
    CONSTRAINT [PK_tbAdminUsuario] PRIMARY KEY CLUSTERED ([AdminUsuarioId] ASC),
    CONSTRAINT [UQ_tbAdminUsuario_Usuario] UNIQUE NONCLUSTERED ([Usuario] ASC)
);


GO
