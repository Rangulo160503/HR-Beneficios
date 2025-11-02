CREATE TABLE [core].[Usuario] (
    [UsuarioId]     UNIQUEIDENTIFIER CONSTRAINT [DF_Usuario_UsuarioId] DEFAULT (newid()) NOT NULL,
    [Correo]        NVARCHAR (120)   NOT NULL,
    [Nombre]        NVARCHAR (120)   NULL,
    [Telefono]      VARCHAR (8)      NULL,
    [FechaRegistro] DATETIME2 (7)    CONSTRAINT [DF_Usuario_FechaRegistro] DEFAULT (sysutcdatetime()) NOT NULL,
    [ProveedorId]   UNIQUEIDENTIFIER NULL,
    [PasswordHash]  NVARCHAR (255)   NULL,
    CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED ([UsuarioId] ASC),
    CONSTRAINT [CK_Usuario_TelFormato] CHECK ([Telefono] IS NULL OR [Telefono] like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    CONSTRAINT [FK_Usuario_Proveedor] FOREIGN KEY ([ProveedorId]) REFERENCES [core].[Proveedor] ([ProveedorId])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [UX_Usuario_Correo]
    ON [core].[Usuario]([Correo] ASC);

