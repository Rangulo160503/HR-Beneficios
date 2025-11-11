CREATE TABLE [core].[Usuario] (
    [UsuarioId]     UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Correo]        NVARCHAR (254)   NOT NULL,
    [Nombre]        NVARCHAR (120)   NOT NULL,
    [Telefono]      NVARCHAR (32)    NULL,
    [FechaRegistro] DATETIME2 (3)    DEFAULT (sysutcdatetime()) NOT NULL,
    [PasswordHash]  NVARCHAR (512)   NULL,
    [Tipo]          NVARCHAR (20)    NOT NULL,
    [Estado]        TINYINT          DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED ([UsuarioId] ASC),
    CONSTRAINT [CK_Usuario_Tipo] CHECK ([Tipo]=N'Admin' OR [Tipo]=N'Proveedor' OR [Tipo]=N'Cliente'),
    CONSTRAINT [UQ_Usuario_Correo] UNIQUE NONCLUSTERED ([Correo] ASC)
);




GO
CREATE NONCLUSTERED INDEX [IX_Usuario_Tipo]
    ON [core].[Usuario]([Tipo] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Usuario_Estado]
    ON [core].[Usuario]([Estado] ASC);

