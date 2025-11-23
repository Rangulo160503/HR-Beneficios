CREATE TABLE [core].[ProveedorUsuario] (
    [ProveedorId]     UNIQUEIDENTIFIER NOT NULL,
    [UsuarioId]       UNIQUEIDENTIFIER NOT NULL,
    [Rol]             NVARCHAR (50)    NULL,
    [FechaAsignacion] DATETIME2 (3)    DEFAULT (sysutcdatetime()) NOT NULL,
    CONSTRAINT [PK_ProveedorUsuario] PRIMARY KEY CLUSTERED ([ProveedorId] ASC, [UsuarioId] ASC),
    CONSTRAINT [FK_ProvUser_Proveedor] FOREIGN KEY ([ProveedorId]) REFERENCES [core].[Proveedor] ([ProveedorId]),
    CONSTRAINT [FK_ProvUser_Usuario] FOREIGN KEY ([UsuarioId]) REFERENCES [core].[Usuario] ([UsuarioId])
);


GO
CREATE NONCLUSTERED INDEX [IX_ProveedorUsuario_Usuario]
    ON [core].[ProveedorUsuario]([UsuarioId] ASC);

