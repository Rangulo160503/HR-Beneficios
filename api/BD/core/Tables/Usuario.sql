CREATE TABLE [core].[Usuario] (
    [UsuarioId]     INT            IDENTITY (1, 1) NOT NULL,
    [Correo]        NVARCHAR (120) NOT NULL,
    [Nombre]        NVARCHAR (120) NULL,
    [Telefono]      VARCHAR (8)    NULL,
    [FechaRegistro] DATETIME2 (7)  DEFAULT (sysutcdatetime()) NOT NULL,
    PRIMARY KEY CLUSTERED ([UsuarioId] ASC),
    CHECK ([Telefono] IS NULL OR [Telefono] like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    UNIQUE NONCLUSTERED ([Correo] ASC)
);

