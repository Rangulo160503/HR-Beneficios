CREATE TABLE [core].[Producto] (
    [ProductoId]   UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]       NVARCHAR (150)   NOT NULL,
    [Descripcion]  NVARCHAR (300)   NULL,
    [CreadoEn]     DATETIME2 (7)    DEFAULT (sysdatetime()) NOT NULL,
    [ModificadoEn] DATETIME2 (7)    NULL,
    PRIMARY KEY CLUSTERED ([ProductoId] ASC)
);

