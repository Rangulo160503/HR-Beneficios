CREATE TABLE [core].[Proveedor] (
    [ProveedorId]  INT            IDENTITY (1, 1) NOT NULL,
    [Nombre]       NVARCHAR (120) NOT NULL,
    [Correo]       NVARCHAR (120) NULL,
    [Telefono]     VARCHAR (8)    NULL,
    [Activo]       BIT            DEFAULT ((1)) NOT NULL,
    [CreadoEn]     DATETIME2 (7)  DEFAULT (sysutcdatetime()) NOT NULL,
    [ModificadoEn] DATETIME2 (7)  NULL,
    PRIMARY KEY CLUSTERED ([ProveedorId] ASC),
    CHECK ([Telefono] IS NULL OR [Telefono] like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    UNIQUE NONCLUSTERED ([Nombre] ASC)
);

